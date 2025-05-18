// const express = require('express');
// const router = express.Router();
// const { getVenues } = require('../controllers/venueController');
import express from 'express';
import { getVenues } from '../controllers/venueController.js'; // Note the .js extension

const router = express.Router();
// Add this new endpoint

  
 
router.post('/', getVenues);

// module.exports = router;
export default router;
