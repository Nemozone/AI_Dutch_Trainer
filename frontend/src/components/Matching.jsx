import React, { useState, useEffect } from 'react';

const Matching = ({ exercise, onSubmit }) => {
    const [terms, setTerms] = useState([]);
    const [definitions, setDefinitions] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState(new Set());
    const [wrongPair, setWrongPair] = useState(null);

    useEffect(() => {
        if (exercise.pairs) {
            // Shuffle arrays initially
            const t = (exercise.pairs || []).map(p => ({ id: p.term, text: p.term }));
            const d = (exercise.pairs || []).map(p => ({ id: p.term, text: p.definition })); // Use term as ID to link

            setTerms(t.sort(() => Math.random() - 0.5));
            setDefinitions(d.sort(() => Math.random() - 0.5));
        }
    }, [exercise]);

    const handleTermClick = (term) => {
        if (matchedPairs.has(term.id)) return;
        setSelectedTerm(term);
        setWrongPair(null);
    };

    const handleDefClick = (def) => {
        if (matchedPairs.has(def.id)) return;

        if (selectedTerm) {
            if (selectedTerm.id === def.id) {
                // Match found
                const newMatches = new Set(matchedPairs);
                newMatches.add(def.id);
                setMatchedPairs(newMatches);
                setSelectedTerm(null);

                // Check completion
                if (newMatches.size === exercise.pairs.length) {
                    setTimeout(() => onSubmit("Completed Matching"), 1000);
                }
            } else {
                // Wrong match
                setWrongPair(def.id);
                setTimeout(() => setWrongPair(null), 1000);
                setSelectedTerm(null);
            }
        }
    };

    return (
        <div className="w-full select-none">
            <h3 className="text-2xl font-bold mb-8 text-gray-800">{exercise.question}</h3>

            <div className="flex gap-8 md:gap-12 justify-center">
                {/* Terms Column */}
                <div className="flex flex-col gap-4 w-1/2">
                    {terms.map((item) => {
                        const isSelected = selectedTerm === item;
                        const isMatched = matchedPairs.has(item.id);

                        let baseClass = "p-5 rounded-2xl text-center font-bold cursor-pointer transition-all duration-300 shadow-md border-2 ";
                        if (isMatched) {
                            baseClass += "bg-green-100 border-green-400 text-green-700 opacity-50 scale-95";
                        } else if (isSelected) {
                            baseClass += "bg-indigo-100 border-indigo-500 text-indigo-700 scale-105 shadow-indigo-200";
                        } else {
                            baseClass += "bg-white border-gray-100 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-lg hover:-translate-y-1";
                        }

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleTermClick(item)}
                                className={baseClass}
                            >
                                {item.text}
                            </div>
                        );
                    })}
                </div>

                {/* Definitions Column */}
                <div className="flex flex-col gap-4 w-1/2">
                    {definitions.map((item) => {
                        const isMatched = matchedPairs.has(item.id);

                        let baseClass = "p-5 rounded-2xl text-center font-medium cursor-pointer transition-all duration-300 shadow-md border-2 border-dashed ";
                        if (isMatched) {
                            baseClass += "bg-green-50 border-green-400 text-green-700 opacity-50";
                        } else if (wrongPair === item.id) {
                            baseClass += "bg-red-100 border-red-500 text-red-700 animate-pulse";
                        }
                        else {
                            baseClass += "bg-white border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50";
                        }

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleDefClick(item)}
                                className={baseClass}
                            >
                                {item.text}
                            </div>
                        );
                    })}
                </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-6 font-medium italic">Select a term, then its match.</p>
        </div>
    );
};

export default Matching;
