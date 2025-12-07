import React from 'react';

const Feedback = ({ result, onNext }) => {
    if (!result) return null;

    return (
        <div className={`p-6 rounded-xl shadow-md mb-6 ${result.is_correct ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'}`}>
            <h3 className={`text-xl font-bold mb-2 ${result.is_correct ? 'text-green-800' : 'text-red-800'}`}>
                {result.is_correct ? 'Correct!' : 'Incorrect'}
            </h3>
            <p className="text-gray-700 mb-4">{result.feedback}</p>
            <button
                onClick={onNext}
                className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-900 transition duration-300"
            >
                Next Question
            </button>
        </div>
    );
};

export default Feedback;
