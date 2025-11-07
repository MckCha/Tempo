import express from 'express';
import { getItineraryDays, createItineraryDay, deleteItineraryDay} from '../controllers/itinerary_days.controller.js';

const router = express.Router();

router.get('/', getItineraryDays);
router.post('/', createItineraryDay);
router.delete('/:id', deleteItineraryDay);

export default router;