
// const axios = require('axios');
import axios from 'axios';


async function getVenueImage(venueName, location) {
  const query = encodeURIComponent(`${venueName} ${location} banquet hall venue front view`);

  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
  
  try {
    const response = await axios.get('https://api.scrapingdog.com/scrape', {
      params: {
        api_key: process.env.SCRAPINGDOG_API_KEY,
        url: url,
        dynamic: false
      }
    });

    const html = response.data;
    const matches = html.match(/<img[^>]+src="([^">]+)"/g);

    if (matches) {
      const imageUrls = matches
        .map(tag => {
          const match = tag.match(/src="([^">]+)"/);
          return match ? match[1] : null;
        })
        .filter(src => src && src.includes('bing.net') && !src.includes('r.msn.com'));

      return imageUrls.length ? imageUrls[0] : 'https://via.placeholder.com/400x250?text=No+Image';
    } else {
      return 'https://via.placeholder.com/400x250?text=No+Images+Found';
    }

  } catch (err) {
    console.error('❌ Error fetching image with Scrapingdog:', err);
    return 'https://via.placeholder.com/400x250?text=Image+Error';
  }
}

// module.exports = { getVenueImage };
export { getVenueImage };
