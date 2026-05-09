
// export default VenueCard;
// components/VenueCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VenueCard = ({ venue, isPremium, userTier, searchCriteria = {} }) => {
  const [booked, setBooked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Safe default values
  const safeVenue = {
    name: '',
    address: '',
    price_per_head: 0,
    capacity: 0,
    facilities: [],
    image: '',
    ...venue
  };

  const safeSearchCriteria = {
    occasion: '',
    budget: 0,
    people: 1,
    extras: [],
    ...searchCriteria
  };

  const calculateSuitability = () => {
    try {
      let score = 3; // Base score
      
      // Safely calculate score
      if (safeSearchCriteria.occasion && safeVenue.occasionType) {
        score += safeVenue.occasionType.toLowerCase() === safeSearchCriteria.occasion.toLowerCase() ? 1 : 0;
      }
      
      if (safeSearchCriteria.budget && safeVenue.price_per_head) {
        const budgetPerHead = safeSearchCriteria.people 
          ? safeSearchCriteria.budget / safeSearchCriteria.people 
          : safeSearchCriteria.budget;
        score += safeVenue.price_per_head <= budgetPerHead * 1.1 ? 1 : 0;
      }
      
      if (safeSearchCriteria.people && safeVenue.capacity) {
        score += safeVenue.capacity >= safeSearchCriteria.people * 0.9 ? 0.5 : 0;
      }
      
      if (safeSearchCriteria.extras && safeVenue.facilities) {
        const matchedExtras = safeSearchCriteria.extras.filter(extra => 
          safeVenue.facilities.includes(extra)
        );
        score += matchedExtras.length * 0.5;
      }
      
      return Math.min(5, Math.max(1, Math.round(score)));
    } catch (error) {
      console.error("Error calculating suitability:", error);
      return 3; // Default score if calculation fails
    }
  };

  const handleBooking = () => {
    try {
      if (safeVenue.premium && userTier !== 'pro') {
        alert('Upgrade to Pro to book premium venues!');
        return;
      }
      alert(`Booking requested for ${safeVenue.name}`);
      setBooked(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to process booking. Please try again.");
    }
  };

  const suitabilityScore = calculateSuitability();
  const suitabilityPercentage = (suitabilityScore / 5) * 100;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md max-w-sm border-2 ${
      safeVenue.premium && userTier !== 'pro' 
        ? 'border-orange-300 bg-orange-50' 
        : 'border-transparent'
    } transition-all`}>
      
      {/* Suitability Meter */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Suitability:</span>
          <span>{suitabilityScore}/5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              suitabilityPercentage > 70 ? 'bg-green-500' :
              suitabilityPercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${suitabilityPercentage}%` }}
          />
        </div>
      </div>

      {/* Image Section */}
      <div className="h-48 w-full mb-3 overflow-hidden rounded">
        <img
          src={safeVenue.image || 'https://via.placeholder.com/400x250?text=Venue+Image'}
          alt={safeVenue.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Available';
          }}
        />
      </div>

      {/* Venue Info */}
      <h3 className="text-xl font-bold text-blue-700">{safeVenue.name}</h3>
      <p className="text-sm text-gray-600">{safeVenue.address}</p>
      
      {/* Key Features */}
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          ₹{safeVenue.price_per_head}/person
        </span>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
          Capacity: {safeVenue.capacity}
        </span>
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        disabled={booked}
        className={`mt-4 w-full py-2 rounded ${
          booked ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition`}
      >
        {booked ? 'Booked' : 'Book Now'}
      </button>
    </div>
  );
};

export default VenueCard;