import React, { useState } from 'react';

const FillInBlank = ({ exercise, onSubmit }) => {
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (submitted || !answer.trim()) return;
        setSubmitted(true);
        onSubmit(answer);
    };

    // Split question by "_____"
    const parts = exercise.question.split('_____');
    const prefix = parts[0] || exercise.question;
    const suffix = parts[1] || '';

    return (
        <div className="w-full">
            <h3 className="text-2xl font-bold mb-8 text-gray-800 leading-relaxed">
                {prefix}
                <span className="inline-block mx-2 relative top-1">
                    <form onSubmit={handleSubmit} className="inline-flex items-center">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={submitted}
                            className="bg-indigo-50 border-b-4 border-indigo-300 text-indigo-900 text-xl font-bold px-4 py-2 w-48 focus:outline-none focus:border-indigo-600 rounded-t-lg transition-colors placeholder-indigo-200"
                            placeholder="type here..."
                            autoFocus
                        />
                        {!submitted && (
                            <button
                                type="submit"
                                className="ml-3 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 hover-scale shadow-lg disabled:opacity-50"
                                disabled={!answer.trim()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        )}
                    </form>
                </span>
                {suffix}
            </h3>
        </div>
    );
};

export default FillInBlank;
