





// const axios = require('axios');
// require('dotenv').config();
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY=process.env.GEMINI_API_KEY

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function parseVenuesFromText(text) {
  const venueBlocks = text.split(/\n(?=\d+\.)/); // Splits on numbered lines like 1., 2., etc.
  const venues = venueBlocks.map((block,i) => {
    const nameMatch = block.match(/^\d+\.\s*(.*)/);
    const name = nameMatch ? nameMatch[1].trim() : "Unnamed Venue";

    const address = block.match(/Address: (.*)/)?.[1] || "N/A";
    const capacity = block.match(/Capacity: (.*)/)?.[1] || "N/A";
    const cost = block.match(/Estimated Cost: (.*)/)?.[1] || "N/A";
    const supports = block.match(/Support for.*?: (.*)/)?.[1] || "N/A";
    const reason = block.match(/Why.*?: (.*)/)?.[1] || "N/A";

    return {
      name,
      address,
      capacity,
      cost,
      supports,
      reason,
      image: "https://source.unsplash.com/featured/?wedding,hall," + i
    };
  });

  return venues;
}

const getGeminiVenueSuggestions = async (input) => {
  const { budget, location, occasion, people, extras } = input;

  const prompt = `
You are a venue recommendation assistant.

Input:
- Budget: ₹${budget}
- Location: ${location}
- Occasion: ${occasion}
- Guests: ${people}
- Extras: ${extras.join(', ')}

Give me 5 suitable venues. Each should be in this format:
1. [Venue Name]
Address: ...
Capacity: ...
Estimated Cost: ...
Support for extra requirements: ...
Why it’s recommended: ...
`;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const resultText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error("Gemini API returned no content");

    const venues = parseVenuesFromText(resultText);
    return venues;
  } catch (error) {
    console.error("ERROR in getVenueRecommendations:", error.response?.data || error.message);
    throw error;
  }
};

// module.exports = { getGeminiVenueSuggestions };
export { getGeminiVenueSuggestions };
