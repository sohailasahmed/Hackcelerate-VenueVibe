

// export default Home;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import VenueCard from '../components/VenueCard';
import { Link } from 'react-router-dom';

const Home = ({ venueSectionRef, onFindClick, userTier }) => {
  const [form, setForm] = useState({
    budget: '',
    location: '',
    occasion: '',
    people: '',
    extras: '',
  });
  const [venues, setVenues] = useState([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const extrasArray = form.extras.split(',').map((s) => s.trim());

    try {
      const res = await axios.post('http://localhost:5000/api/venues', {
        ...form,
        extras: extrasArray,
      });

      setVenues(res.data.venues);
      
      // Show upgrade prompt for basic users with limited results
      if (userTier === 'basic' && res.data.venues.length >= 3) {
        setShowUpgradePrompt(true);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  // Subscription-aware venue display
  const displayedVenues = userTier === 'pro' 
    ? venues 
    : venues.slice(0, 3); // Limit to 3 for basic users

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="text-center py-32 px-6 bg-gradient-to-r from-blue-100 to-blue-200 min-h-[80vh] flex flex-col justify-center items-center">
        <h2 className="text-5xl font-bold text-blue-900 mb-6">Celebrate Without Compromise</h2>
        <p className="text-xl text-blue-700 mb-8">
          {userTier === 'pro' 
            ? 'Enjoy unlimited premium venue recommendations!' 
            : 'Find the perfect venue for your next celebration'
          }
        </p>
        <button 
          onClick={onFindClick} 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {userTier === 'pro' ? 'Browse Premium Venues' : 'Find Your Venue'}
        </button>
        {userTier === 'basic' && (
          <Link 
            to="/subscriptions" 
            className="mt-4 text-blue-600 hover:underline flex items-center"
          >
            Upgrade to Pro for more options
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </section>

      {/* Search Form */}
      <form
        ref={venueSectionRef}
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4 mt-20 relative"
      >
        {userTier === 'pro' && (
          <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PRO
          </div>
        )}
        <input type="text" name="budget" placeholder="Budget (in INR)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="location" placeholder="City/Location" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="occasion" placeholder="Occasion (e.g., Wedding)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="people" placeholder="Number of People" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="extras" placeholder="Extra requirements (comma separated)" onChange={handleChange} className="w-full border p-2 rounded" />
        <button 
          type="submit" 
          className={`w-full py-2 rounded hover:bg-blue-700 transition ${userTier === 'pro' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
        >
          {userTier === 'pro' ? 'Find Premium Venues' : 'Find Venues'}
        </button>
      </form>

      {/* Venue Cards */}
      {displayedVenues.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-20">
          {displayedVenues.map((venue, idx) => (
            <VenueCard 
              key={idx} 
              venue={venue} 
              isPremium={userTier === 'pro'}
            />
          ))}
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && userTier === 'basic' && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 text-center">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <p>Want to see all {venues.length} venues? Upgrade to Pro for unlimited access!</p>
            <Link 
              to="/subscriptions" 
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 ml-4"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;