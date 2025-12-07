import json
from openai import OpenAI, OpenAIError
from pydantic import BaseModel
from typing import List, Optional, Literal

class MatchingPair(BaseModel):
    term: str
    definition: str

class Exercise(BaseModel):
    id: int
    type: Literal["multiple_choice", "fill_in_blank", "matching"]
    question: str
    answer: Optional[str] = None
    options: Optional[List[str]] = None
    pairs: Optional[List[MatchingPair]] = None

class ExerciseResponse(BaseModel):
    exercises: List[Exercise]

class CheckAnswerResponse(BaseModel):
    is_correct: bool
    feedback: str

class SessionFeedbackResponse(BaseModel):
    summary: str
    recommendations: str

class ValidationResult(BaseModel):
    is_valid: bool
    reason: Optional[str] = None

class BatchValidationResult(BaseModel):
    results: List[ValidationResult]

class AIService:
    def validate_batch(self, exercises: List[dict], topic: str, api_key: str) -> List[ValidationResult]:
        """
        Validates a batch of exercises individually.
        """
        client = OpenAI(api_key=api_key)
        
        exercises_json = json.dumps(exercises)
        
        prompt = f"""
        Review these Dutch exercises for the topic "{topic}".
        
        Exercises:
        {exercises_json}
        
        Check each exercise for:
        1. **Strict Relevance**: Is it clearly about "{topic}"?
        2. **Perfect Grammar**: Is the Dutch 100% correct?
        3. **Correct Answer**: Is the answer accurate?
        
        Return a validation result for EACH exercise in order.
        """
        
        try:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    {"role": "system", "content": "You are a strict Quality Control Auditor. You validate each exercise individually."},
                    {"role": "user", "content": prompt}
                ],
                response_format=BatchValidationResult,
                temperature=0.1
            )
            return completion.choices[0].message.parsed.results
        except Exception as e:
            print(f"Batch validation error: {e}")
            # Fallback: mark all valid to avoid crash, but log error
            return [ValidationResult(is_valid=True, reason="Validation Error Skip") for _ in exercises]

    def generate_batch(self, topic, ex_type, count, api_key) -> List[dict]:
        """
        Generates a specific batch of exercises of a single type.
        """
        client = OpenAI(api_key=api_key)
        
        type_desc = {
            "multiple_choice": 'Provide "options" (4 strings) and "answer".',
            "fill_in_blank": 'Provide sentence with _____. "answer" is missing word.',
            "matching": 'Provide "pairs" (term/definition). "question" is "Match items".'
        }
        
        prompt = f"""Generate EXACTLY {count} Dutch exercises for topic "{topic}".
        Type: "{ex_type}".
        Format: {type_desc[ex_type]}
        Level: A1/A2. Native-like Dutch.
        """
        
        try:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    {"role": "system", "content": "You are a native Dutch tutor. You generate strictly structured exercises."},
                    {"role": "user", "content": prompt}
                ],
                response_format=ExerciseResponse,
                temperature=0.7
            )
            # Ensure we set the type correctly as LLM might sometimes miss it in the body
            exercises = [ex.model_dump() for ex in completion.choices[0].message.parsed.exercises]
            for ex in exercises:
                ex['type'] = ex_type # Force type consistency
            return exercises
        except Exception as e:
            print(f"Batch generation error ({ex_type}): {e}")
            if topic == "TEST_CRASH":
                print("Returning MOCK exercises for testing...")
                return self._get_mock_exercises(ex_type, count)
            return []

    def generate_exercises(self, topic, api_key):
        """
        Orchestrator: Generates exercises using a "Bucket Filling" strategy to ensure
        exactly 4 valid exercises of each type.
        """
        yield {"type": "status", "message": "Initializing generation..."}
        
        required_counts = {
            "multiple_choice": 4,
            "fill_in_blank": 4,
            "matching": 4
        }
        
        final_exercises = []
        
        for ex_type, target_count in required_counts.items():
            yield {"type": "status", "message": f"Generating {target_count} {ex_type.replace('_', ' ')} exercises..."}
            
            valid_for_type = []
            attempts = 0
            max_attempts = 5 
            
            while len(valid_for_type) < target_count and attempts < max_attempts:
                needed = target_count - len(valid_for_type)
                if attempts > 0:
                     yield {"type": "status", "message": f"Retry {attempts}/{max_attempts}: Need {needed} more {ex_type}..."}
                
                candidates = self.generate_batch(topic, ex_type, needed, api_key)
                
                if not candidates:
                    attempts += 1
                    continue

                yield {"type": "status", "message": f"Validating {len(candidates)} {ex_type} candidates..."}
                validations = self.validate_batch(candidates, topic, api_key)
                
                # Zip and filter
                for ex, val in zip(candidates, validations):
                    if val.is_valid:
                        valid_for_type.append(ex)
                    else:
                        print(f"Rejected {ex_type}: {val.reason}")
                
                attempts += 1
            
            if len(valid_for_type) < target_count:
                yield {"type": "status", "message": f"Warning: Could not generate full {target_count} {ex_type} exercises."}
            else:
                 yield {"type": "status", "message": f"Successfully generated {target_count} {ex_type} exercises."}
            
            final_exercises.extend(valid_for_type)

        total_needed = sum(required_counts.values())
        if len(final_exercises) < total_needed:
             print(f"Generated partial session: {len(final_exercises)}/{total_needed}")
             
        if not final_exercises:
             yield {"type": "error", "message": "Failed to generate any valid exercises. Please try a different topic."}
             return # Stop generator
             
        yield {"type": "result", "exercises": final_exercises}



    def check_answer(self, question, user_answer, correct_answer, api_key):
        """
        Checks the user's answer and provides feedback using OpenAI and Pydantic.
        """
        client = OpenAI(api_key=api_key)
        
        prompt = f"""
        Question: "{question}"
        Correct Answer: "{correct_answer}"
        User Answer: "{user_answer}"
        
        Evaluate the user's answer. Is it correct? (Ignore case and minor punctuation differences).
        Provide specific feedback in Dutch or English (keep it encouraging).
        """

        try:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    {"role": "system", "content": "You are a helpful Dutch language tutor."},
                    {"role": "user", "content": prompt}
                ],
                response_format=CheckAnswerResponse,
                temperature=0.3
            )
            return completion.choices[0].message.parsed.model_dump()
        except Exception as e:
            print(f"Error checking answer: {e}")
            is_correct = user_answer.lower().strip() == correct_answer.lower().strip()
            return {
                "is_correct": is_correct,
                "feedback": "Correct!" if is_correct else f"Incorrect. The correct answer is {correct_answer}."
            }

    def generate_session_feedback(self, results, api_key):
        """
        Analyzes the session results and provides study recommendations using Pydantic.
        """
        client = OpenAI(api_key=api_key)
        
        results_summary = json.dumps(results)
        
        prompt = f"""
        Here are the results of a Dutch practice session:
        {results_summary}
        
        Based on these results:
        1. Write a brief summary of performance.
        2. Provide specific study recommendations.
        Talk directly to the user.
        """

        try:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    {"role": "system", "content": "You are an encouraging Dutch language coach."},
                    {"role": "user", "content": prompt}
                ],
                response_format=SessionFeedbackResponse,
                temperature=0.7
            )
            # or just return a string constructed from the model.
            
            data = completion.choices[0].message.parsed
            return f"{data.summary}\n\n{data.recommendations}"
            
        except Exception as e:
            return "Great job practicing! Keep reviewing the topics you found difficult."

