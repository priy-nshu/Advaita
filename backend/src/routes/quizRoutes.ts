import { Router } from 'express';

const router = Router();

// TODO: Add quiz routes
router.get('/', (_req, res) => {
  res.json({ message: 'Quiz routes coming soon' });
});

export default router; 