import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicInput from '../components/TopicInput';
import ApiKeyInput from '../components/ApiKeyInput';

const Home = () => {
    const navigate = useNavigate();
    const [apiKey, setApiKey] = useState('');

    const handleStart = (topic) => {
        if (!apiKey) {
            alert("Please enter your OpenAI API Key first.");
            return;
        }
        localStorage.setItem('last_topic', topic);
        navigate('/practice', { state: { topic, apiKey } });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="z-10 w-full max-w-lg">
                <div className="text-center mb-10 animate-slide-up">
                    <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">
                        Dutch<span className="text-teal-200">AI</span> Tutor
                    </h1>
                    <p className="text-xl text-white/90 font-medium">
                        Master the language with intelligent, adaptive practice.
                    </p>
                </div>

                <div className="glass-card p-8 rounded-3xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="space-y-6">
                        <ApiKeyInput onSave={setApiKey} />
                        {apiKey && <TopicInput onStart={handleStart} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
