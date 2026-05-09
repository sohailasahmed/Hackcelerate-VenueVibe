import express from 'express';
const router = express.Router();

// Mock subscription plans
router.get('/plans', (req, res) => {
  res.json([
    {
      id: "basic",
      name: "Basic",
      price: 0,
      features: ["5 venue recommendations/day", "Standard venues"]
    },
    {
      id: "pro",
      name: "Pro",
      price: 9.99,
      features: ["Unlimited recommendations", "Premium venues", "Priority support"]
    }
  ]);
});

// Mock subscription status check
router.get('/status', (req, res) => {
  res.json({ 
    tier: "basic", // Mock response - replace with real check later
    expiresAt: null 
  });
});

export default router;