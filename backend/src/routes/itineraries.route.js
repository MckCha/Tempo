import express from 'express';
import { getItineraries, createItinerary, deleteItinerary } from '../controllers/itineraries.controller.js';


const router = express.Router();

router.get('/', getItineraries);
router.post('/', createItinerary);
router.delete('/:id', deleteItinerary);



export default router;