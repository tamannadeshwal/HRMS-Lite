import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeAttendanceStats,
} from '../controllers/employeeController.js';
import { validate } from '../middleware/validation.js';
import { employeeValidation } from '../utils/validators.js';

const router = express.Router();

router.get('/', getAllEmployees);
router.get('/:id', employeeValidation.getById, validate, getEmployeeById);
router.get('/:id/stats', employeeValidation.getById, validate, getEmployeeAttendanceStats);
router.post('/', employeeValidation.create, validate, createEmployee);
router.put('/:id', employeeValidation.update, validate, updateEmployee);
router.delete('/:id', employeeValidation.delete, validate, deleteEmployee);

export default router;
