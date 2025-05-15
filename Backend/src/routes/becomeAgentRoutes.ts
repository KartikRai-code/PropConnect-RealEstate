import express from 'express';
import { submitAgentApplication } from '../controllers/becomeAgentController';

const router = express.Router();

// POST endpoint to submit agent application
router.post('/', submitAgentApplication);

export default router;