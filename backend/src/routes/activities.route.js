import express from 'express';
import { getActivities, createActivities, deleteActivities } from '../controllers/activities.controller.js';

const router = express.Router();

router.get('/', getActivities);
router.post('/', createActivities);
router.delete('/:id', deleteActivities);

export default router;