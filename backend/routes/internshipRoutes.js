// backend/routes/internshipRoutes.js
import express from 'express';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  listInternships,
  recommendedInternships,
  createInternship,
  updateInternshipStatus,
  deleteInternship,
  getAllInternships, // <-- 1. IMPORT THE NEW FUNCTION
  applyToInternship,
  getAppliedInternships,
} from '../controllers/internshipController.js';

const router = express.Router();

// === Public Route (for students) ===
router.get('/list', listInternships); // Students will use this

// === Student Protected Routes ===
router.post('/recommendations', authMiddleware, recommendedInternships);

router.get('/applied', authMiddleware, getAppliedInternships);

router.post('/:id/apply', authMiddleware, applyToInternship);

// === Admin Protected Routes ===
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getAllInternships
);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createInternship
);

router.put(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  updateInternshipStatus
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteInternship
);

export default router;