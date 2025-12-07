import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorId: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const errorId = Date.now().toString(36);
        this.setState({ errorId });

        console.error("Uncaught error:", error, errorInfo);

        // Send to backend
        fetch('http://localhost:8000/api/log_error/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error.toString(),
                stack: error.stack,
                componentStack: errorInfo.componentStack
            })
        }).catch(e => console.error("Failed to report error:", e));
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                    <div className="bg-red-900/50 p-8 rounded-xl max-w-lg border border-red-500/50 backdrop-blur-xl">
                        <h1 className="text-3xl font-bold mb-4 text-red-200">Something went wrong</h1>
                        <p className="mb-4 text-gray-300">
                            The application has encountered an unexpected error.
                            It has been logged automatically for investigation.
                        </p>
                        <div className="bg-black/50 p-4 rounded font-mono text-xs text-red-300 mb-6 overflow-auto max-h-40">
                            Error ID: {this.state.errorId}
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
