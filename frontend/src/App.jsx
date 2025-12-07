import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PracticeSession from './pages/PracticeSession';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<PracticeSession />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
