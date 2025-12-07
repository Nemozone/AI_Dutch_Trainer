import React, { useState, useEffect } from 'react';

const ApiKeyInput = ({ onSave }) => {
    const [apiKey, setApiKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            onSave(storedKey);
        }
    }, [onSave]);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('openai_api_key', apiKey);
            onSave(apiKey);
            alert('API Key saved!');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">OpenAI API Key</h2>
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <input
                        type={isVisible ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                        {isVisible ? 'Hide' : 'Show'}
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900 transition duration-300"
                >
                    Save Key
                </button>
                <p className="text-xs text-gray-500">
                    Your key is stored locally in your browser and sent only to the backend for this session.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyInput;
