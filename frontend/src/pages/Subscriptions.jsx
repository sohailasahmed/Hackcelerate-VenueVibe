
import React from 'react';
import VenueCard from '../components/VenueCard';
import { useNavigate } from 'react-router-dom';

export default function Subscriptions({ currentTier, onSubscriptionChange }) {
  const navigate = useNavigate();
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      features: ['3 venue recommendations/day', 'Standard venues'],
      buttonText: currentTier === 'basic' ? 'Current Plan' : 'Downgrade'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      features: ['Unlimited recommendations', 'Premium venues', 'Priority support'],
      buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade Now'
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId === currentTier) return;
    
    localStorage.setItem('mockTier', planId);
    if (onSubscriptionChange) {
      onSubscriptionChange(planId);
    } else {
      // Fallback if prop not provided
      window.location.reload();
    }
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-4xl font-bold mb-4">
              ${plan.price}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelect(plan.id)}
              className={`w-full py-2 rounded-md ${
                plan.id === currentTier
                  ? 'bg-gray-200 text-gray-800 cursor-default'
                  : plan.id === 'pro'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
              disabled={plan.id === currentTier}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}