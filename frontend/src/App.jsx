


import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscriptions from './pages/Subscriptions';
import SubscriptionBadge from './components/SubscriptionBadge';

const App = () => {
  const venueSectionRef = useRef(null);
  const [userTier, setUserTier] = useState('basic');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize subscription state
    const mockTier = localStorage.getItem('mockTier') || 'basic';
    setUserTier(mockTier);
    
    // Clear mock data in development when app starts
    if (import.meta.env.DEV) {
      localStorage.removeItem('mockTier');
    }
  }, []);

  const handleFindVenuesClick = () => {
    venueSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscriptionChange = (tier) => {
    localStorage.setItem('mockTier', tier);
    setUserTier(tier);
    navigate('/'); // Redirect to home after changing subscription
  };

  return (
    <div className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Event Venue Finder</h1>
        <div className="flex items-center space-x-4">
          <SubscriptionBadge tier={userTier} />
          
          {/* Subscription Toggle (Visible when logged in) */}
          {userTier === 'pro' ? (
            <button
              onClick={() => handleSubscriptionChange('basic')}
              className="text-sm text-red-600 hover:underline"
            >
              Switch to Basic
            </button>
          ) : (
            <Link 
              to="/subscriptions"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Upgrade
            </Link>
          )}

          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>

          {/* Developer Reset Button (Visible only in development) */}
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                localStorage.removeItem('mockTier');
                window.location.reload();
              }}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
              title="Reset demo state"
            >
              🛠️ Reset
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              venueSectionRef={venueSectionRef} 
              onFindClick={handleFindVenuesClick}
              userTier={userTier}
              onSubscriptionChange={handleSubscriptionChange}
            />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
  path="/subscriptions" 
  element={
    <Subscriptions 
      currentTier={userTier}
      onSubscriptionChange={handleSubscriptionChange} 
    />
  } 
/>
      </Routes>
    </div>
  );
};

// Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}