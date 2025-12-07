import React, { useEffect, useRef } from 'react';

const GenerationLog = ({ logs }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md rounded-xl p-6 font-mono text-sm text-green-400 shadow-2xl border border-green-500/30 overflow-hidden flex flex-col h-64">
            <div className="flex items-center gap-2 border-b border-green-500/20 pb-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="ml-2 text-xs text-green-300/50">SYSTEM_STATUS_LOG</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                {logs.map((log, index) => (
                    <div key={index} className="animate-fade-in flex">
                        <span className="text-green-600 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                        <span className={log.type === 'error' ? 'text-red-400' : 'text-green-300'}>
                            {log.type === 'status' && '> '}
                            {log.message}
                        </span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
};

export default GenerationLog;
