import React from 'react';
import MultipleChoice from './MultipleChoice';
import FillInBlank from './FillInBlank';
import Matching from './Matching';

const ExerciseCard = ({ exercise, onSubmit }) => {

    const renderContent = () => {
        if (!exercise) return <div className="text-red-500">Error: No exercise data</div>;

        switch (exercise.type) {
            case 'multiple_choice':
                if (!exercise.options || exercise.options.length === 0) {
                    return <div className="text-red-400 p-4">Error: Multiple choice options missing.</div>;
                }
                return <MultipleChoice exercise={exercise} onSubmit={onSubmit} />;
            case 'fill_in_blank':
                if (!exercise.question.includes('_____')) {
                    // Fallback or just render. FillInBlank handles splitting safely? Let's verify.
                    // It assumes split('_____') works.
                }
                return <FillInBlank exercise={exercise} onSubmit={onSubmit} />;
            case 'matching':
                if (!exercise.pairs || exercise.pairs.length === 0) {
                    return <div className="text-red-400 p-4">Error: Matching pairs missing.</div>;
                }
                return <Matching exercise={exercise} onSubmit={onSubmit} />;
            default:
                // ... legacy fallback ...
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Question {exercise.id}</h3>
                        <p className="text-lg mb-6 text-gray-800">{exercise.question}</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit(e.target.elements.answer.value);
                        }}>
                            <input
                                name="answer"
                                type="text"
                                placeholder="Type your answer here..."
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                Check Answer
                            </button>
                        </form>
                    </div>
                );
        }
    };

    return (
        <div className="glass-card p-8 rounded-3xl mb-8 animate-slide-up transition-all duration-300">
            {renderContent()}
        </div>
    );
};

export default ExerciseCard;
