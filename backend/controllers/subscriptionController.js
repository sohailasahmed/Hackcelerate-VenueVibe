// backend/controllers/subscriptionController.js
import { readFile } from 'fs/promises';
import path from 'path';

const subscriptionsPath = path.join(process.cwd(), 'backend', 'data', 'subscriptions.json');

// Add this export
export const checkSubscription = (user) => {
  // Mock implementation - replace with real logic later
  return user?.subscription?.tier || 'basic';
};

// Other subscription-related functions
export const getSubscriptionPlans = async () => {
  try {
    const data = await readFile(subscriptionsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscriptions:', error);
    return [];
  }
};