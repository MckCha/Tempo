import express from 'express';
import { getConversations, createConversation, deleteConversation } from '../controllers/conversation.controller.js';

const router = express.Router();

router.get('/', getConversations);
router.post('/', createConversation);
router.delete('/:id', deleteConversation);

export default router;