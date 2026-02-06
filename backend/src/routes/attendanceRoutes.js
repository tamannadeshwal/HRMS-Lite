import express from 'express';
import {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
} from '../controllers/attendanceController.js';
import { validate } from '../middleware/validation.js';
import { attendanceValidation } from '../utils/validators.js';

const router = express.Router();

router.get('/', attendanceValidation.query, validate, getAllAttendance);
router.get('/stats', attendanceValidation.query, validate, getAttendanceStats);
router.get('/:id', attendanceValidation.getById, validate, getAttendanceById);
router.post('/', attendanceValidation.create, validate, createAttendance);
router.put('/:id', attendanceValidation.update, validate, updateAttendance);
router.delete('/:id', attendanceValidation.delete, validate, deleteAttendance);

export default router;
