from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse
import json
from .services import AIService

class GenerateExercisesView(APIView):
    def post(self, request):
        topic = request.data.get('topic')
        api_key = request.data.get('api_key')
        
        if not topic or not api_key:
            return Response({"error": "Topic and API Key are required"}, status=status.HTTP_400_BAD_REQUEST)

        ai_service = AIService()
        
        def event_stream():
            try:
                for update in ai_service.generate_exercises(topic, api_key):
                    yield json.dumps(update) + "\n"
            except Exception as e:
                yield json.dumps({"type": "error", "message": f"Server Error: {str(e)}"}) + "\n"

        response = StreamingHttpResponse(event_stream(), content_type='application/x-ndjson')
        response['X-Accel-Buffering'] = 'no' # Disable buffering for Nginx/proxies if applicable
        return response

class CheckAnswerView(APIView):
    def post(self, request):
        question = request.data.get('question')
        user_answer = request.data.get('user_answer')
        correct_answer = request.data.get('correct_answer')
        api_key = request.data.get('api_key')
        
        if not all([question, user_answer, correct_answer]):
             return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        if not api_key:
            return Response({"error": "API Key is required"}, status=status.HTTP_400_BAD_REQUEST)

        ai_service = AIService()
        result = ai_service.check_answer(question, user_answer, correct_answer, api_key)
        return Response(result)

class SessionFeedbackView(APIView):
    def post(self, request):
        results = request.data.get('results')
        api_key = request.data.get('api_key')

        if not results or not api_key:
             return Response({"error": "Missing results or API key"}, status=status.HTTP_400_BAD_REQUEST)

        ai_service = AIService()
        try:
            feedback = ai_service.generate_session_feedback(results, api_key)
            return Response({"feedback": feedback})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LogErrorView(APIView):
    def post(self, request):
        import logging
        logger = logging.getLogger('practice')
        
        error_msg = request.data.get('error')
        stack = request.data.get('stack')
        component_stack = request.data.get('componentStack')
        
        logger.error(f"FRONTEND ERROR: {error_msg}\nStack: {stack}\nComponent Stack: {component_stack}")
        
        return Response({"status": "logged"})
