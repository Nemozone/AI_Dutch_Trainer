import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExerciseCard from '../components/ExerciseCard';
import Feedback from '../components/Feedback';
import GenerationLog from '../components/GenerationLog';

const PracticeSession = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Recover state from navigation OR localStorage (for refresh persistence)
    const topic = location.state?.topic || localStorage.getItem('last_topic');
    const apiKey = location.state?.apiKey || localStorage.getItem('openai_api_key');

    const [exercises, setExercises] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]); // Track user performance
    const [sessionComplete, setSessionComplete] = useState(false);
    const [aiRecommendations, setAiRecommendations] = useState("");

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!topic || !apiKey) {
            navigate('/');
            return;
        }

        const fetchExercises = async () => {
            setLoading(true);
            setLogs([]); // Reset logs
            try {
                const response = await fetch('http://localhost:8000/api/generate/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic, api_key: apiKey }),
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');

                    // Process all complete lines
                    buffer = lines.pop(); // Keep incomplete chunk in buffer

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const data = JSON.parse(line);
                            if (data.type === 'status') {
                                setLogs(prev => [...prev, data]);
                            } else if (data.type === 'result') {
                                setExercises(data.exercises);
                                setLoading(false);
                            } else if (data.type === 'error') {
                                setError(data.message);
                                setLoading(false);
                            }
                        } catch (e) {
                            console.error("Error parsing stream line:", line, e);
                        }
                    }
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError('Failed to connect to server.');
                setLoading(false);
            }
        };

        fetchExercises();
    }, [topic, apiKey, navigate]);

    const handleAnswerSubmit = async (userAnswer) => {
        const currentExercise = exercises[currentExerciseIndex];
        let interactFeedback = null;

        // Bypass backend check for self-validating exercises
        if (currentExercise.type === 'matching') {
            interactFeedback = {
                is_correct: true,
                feedback: "Great job matching all pairs!"
            };
        } else {
            try {
                const response = await axios.post('http://localhost:8000/api/check/', {
                    question: currentExercise.question,
                    user_answer: userAnswer,
                    correct_answer: currentExercise.answer,
                    api_key: apiKey
                });
                interactFeedback = response.data;
            } catch (err) {
                console.error("Error checking answer:", err);
                interactFeedback = { is_correct: false, feedback: "Error checking answer. Please try again." };
            }
        }

        setFeedback(interactFeedback);

        // Track result
        setResults(prev => [...prev, {
            question: currentExercise.question,
            type: currentExercise.type,
            is_correct: interactFeedback.is_correct
        }]);
    };

    const handleNext = async () => {
        setFeedback(null);
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // Session finished
            finishSession();
        }
    };

    const finishSession = async () => {
        setLoading(true);
        try {
            // Get AI feedback
            const response = await axios.post('http://localhost:8000/api/feedback/', {
                results: results,
                api_key: apiKey
            });
            setAiRecommendations(response.data.feedback);
        } catch (err) {
            console.error("Error getting feedback:", err);
            setAiRecommendations("Great job completing the session!");
        }
        setSessionComplete(true);
        setLoading(false);
    };

    const progress = Math.round(((currentExerciseIndex) / exercises.length) * 100);

    if (loading && !sessionComplete) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl animate-slide-up flex flex-col items-center">
                    <div className="text-4xl mb-4 animate-bounce">⚡️</div>
                    <h2 className="text-2xl font-bold text-white mb-6">Building Your Session</h2>
                    <GenerationLog logs={logs} />
                </div>
            </div>
        );
    }
    if (error) return <div className="min-h-screen flex items-center justify-center text-white bg-red-500/80 backdrop-blur-md p-8 rounded-xl max-w-lg mx-auto mt-20">{error}</div>;

    if (sessionComplete) {
        const correctCount = results.filter(r => r.is_correct).length;
        const scorePercentage = Math.round((correctCount / exercises.length) * 100);

        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-10 rounded-[2rem] max-w-2xl w-full animate-slide-up text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-4xl font-extrabold text-indigo-900 mb-2">Session Complete!</h2>
                    <p className="text-gray-500 mb-8 font-medium">Here's how you performed</p>

                    <div className="relative mb-10 inline-block">
                        {/* Score Circle */}
                        <div className="w-40 h-40 rounded-full border-8 border-indigo-100 flex items-center justify-center mx-auto bg-white shadow-inner">
                            <div>
                                <div className="text-5xl font-black text-indigo-600">{scorePercentage}%</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 mb-10 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-indigo-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
                            <span className="bg-indigo-600 text-white rounded-md p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.463.253-3.56.719l4.474 4.36A4 4 0 0110 9v-.603z" /><path d="M14.5 4c-1.255 0-2.463.253-3.56.719L2.5 13.118a8 8 0 1015.448-4.757L14.5 4z" /></svg>
                            </span>
                            AI Coach Feedback
                        </h3>
                        <p className="text-gray-700 leading-relaxed font-medium">"{aiRecommendations}"</p>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 hover-scale shadow-xl shadow-indigo-300/50 transition duration-300 text-lg"
                    >
                        Start New Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                {/* Header & Progress */}
                <div className="flex justify-between items-end mb-4 text-white">
                    <h2 className="text-3xl font-bold tracking-tight">{topic}</h2>
                    <span className="text-white/80 font-medium">Q{currentExerciseIndex + 1} / {exercises.length}</span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-black/20 rounded-full h-3 mb-8 backdrop-blur-sm overflow-hidden">
                    <div
                        className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {!feedback ? (
                    <ExerciseCard
                        exercise={exercises[currentExerciseIndex]}
                        onSubmit={handleAnswerSubmit}
                    />
                ) : (
                    <Feedback result={feedback} onNext={handleNext} />
                )}
            </div>
        </div>
    );
};

export default PracticeSession;
