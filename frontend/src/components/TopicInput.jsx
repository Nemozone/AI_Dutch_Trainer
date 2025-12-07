import React, { useState } from 'react';

const TopicInput = ({ onStart }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim()) {
            onStart(topic);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">What do you want to practice?</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Present Perfect, Food Vocabulary"
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Start Practice
                </button>
            </form>
        </div>
    );
};

export default TopicInput;
