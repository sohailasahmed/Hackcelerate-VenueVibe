// routes/bookingRoutes.js
// import express from 'express';
import Booking from '../models/Booking.js'; // include the .js extension

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

// module.exports = router;
export default router;
