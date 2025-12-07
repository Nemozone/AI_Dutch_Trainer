import React, { useState } from 'react';

const MultipleChoice = ({ exercise, onSubmit }) => {
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleClick = (option) => {
        if (submitted) return;
        setSelected(option);
        setSubmitted(true);
        onSubmit(option);
    };

    return (
        <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{exercise.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.options.map((option, idx) => {
                    let btnClass = "w-full p-6 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 transform hover-scale shadow-sm ";

                    if (submitted) {
                        if (option === exercise.answer) {
                            btnClass += "bg-green-500 border-green-600 text-white scale-105 shadow-green-200/50";
                        } else if (option === selected) {
                            btnClass += "bg-red-500 border-red-600 text-white opacity-90";
                        } else {
                            btnClass += "bg-gray-100 border-gray-200 text-gray-400 opacity-60";
                        }
                    } else {
                        btnClass += "bg-white border-indigo-100 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-indigo-200";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleClick(option)}
                            className={btnClass}
                            disabled={submitted}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MultipleChoice;
