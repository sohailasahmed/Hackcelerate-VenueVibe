// const express = require('express');
// const router = express.Router();
// const { getVenueImage } = require('../scrapers/imageScraper');
import express from 'express';
import { getVenueImage } from '../scrapers/imageScraper.js'; // include .js extension

const router = express.Router();


router.get('/image', getVenueImage);

// module.exports = router;
export default router;
