
import axios from 'axios';
import { getVenueImage } from '../scrapers/imageScraper.js';
import { checkSubscription } from './subscriptionController.js';

export const getVenues = async (req, res) => {
  const { budget, location, occasion, people, extras } = req.body;
  const userTier = checkSubscription(req.user || {});

  // Debug log - remove after confirmation
  console.log(`[DEBUG] User Tier: ${userTier}, Requesting ${userTier === 'pro' ? 8 : 3} venues`);

  const prompt = `
  STRICTLY return ${userTier === 'pro' ? '8' : '3'} JSON-formatted venue recommendations for:
  - Budget: ₹${budget}
  - Location: ${location}
  - Occasion: ${occasion}
  - Guests: ${people}
  - Extras: ${extras.join(', ')}

  REQUIRED FORMAT:
  [{
    "name": "Venue Name",
    "address": "Full Address",
    "price_per_head": Number,
    "capacity": Number,
    "allows": ["feature1", "feature2"],
    "description": "String",
    ${userTier === 'pro' ? '"premium": true' : ''} // Only for pro
  }]
  `;

  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const raw = geminiResponse.data.candidates[0].content.parts[0].text;
    const jsonMatch = raw.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error('No JSON response from Gemini.');

    let venues = JSON.parse(jsonMatch[0]);

    // HARDCODE venue count as fallback
    const targetCount = userTier === 'pro' ? 8 : 3;
    venues = venues.slice(0, targetCount); // Force correct count

    // Debug log - remove later
    console.log(`[DEBUG] Received ${venues.length} venues`, venues);

    // Image fetching
    const venuesWithImages = await Promise.all(
      venues.map(async (venue) => ({
        ...venue,
        image: await getVenueImage(venue.name, location)
               .catch(() => 'https://via.placeholder.com/400x250?text=Venue+Image')
      }))
    );

    res.json({
      success: true,
      tier: userTier,
      venues: venuesWithImages,
      count: venuesWithImages.length,
      upgradePrompt: userTier === 'basic' ? "Upgrade to PRO for 5+ more venues" : null
    });

    // DEMO OVERRIDE - FORCE 8 VENUES IF PRO
if (userTier === 'pro' && venues.length < 8) {
  venues = [...venues, ...venues, ...venues].slice(0, 8); // Duplicate to reach 8
}

  } catch (err) {
    console.error('Venue generation failed:', err);
    res.status(500).json({
      success: false,
      error: 'Venue generation failed',
      tier: userTier,
      upgradeUrl: userTier === 'basic' ? '/subscriptions' : null
    });
  }
};