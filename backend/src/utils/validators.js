import { body, param, query } from 'express-validator';

export const employeeValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('department')
      .trim()
      .notEmpty().withMessage('Department is required')
      .isLength({ min: 2, max: 50 }).withMessage('Department must be between 2 and 50 characters'),
    body('position')
      .trim()
      .notEmpty().withMessage('Position is required')
      .isLength({ min: 2, max: 100 }).withMessage('Position must be between 2 and 100 characters'),
    body('joinDate')
      .optional()
      .isISO8601().withMessage('Invalid date format')
      .toDate(),
  ],
  update: [
    param('id').isInt({ min: 1 }).withMessage('Invalid employee ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('department')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Department must be between 2 and 50 characters'),
    body('position')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Position must be between 2 and 100 characters'),
    body('joinDate')
      .optional()
      .isISO8601().withMessage('Invalid date format')
      .toDate(),
  ],
  delete: [
    param('id').isInt({ min: 1 }).withMessage('Invalid employee ID'),
  ],
  getById: [
    param('id').isInt({ min: 1 }).withMessage('Invalid employee ID'),
  ],
};

export const attendanceValidation = {
  create: [
    body('employeeId')
      .notEmpty().withMessage('Employee ID is required')
      .isInt({ min: 1 }).withMessage('Invalid employee ID'),
    body('date')
      .notEmpty().withMessage('Date is required')
      .isISO8601().withMessage('Invalid date format')
      .toDate(),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['present', 'absent', 'leave', 'half-day']).withMessage('Invalid status'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
  ],
  update: [
    param('id').isInt({ min: 1 }).withMessage('Invalid attendance ID'),
    body('date')
      .optional()
      .isISO8601().withMessage('Invalid date format')
      .toDate(),
    body('status')
      .optional()
      .isIn(['present', 'absent', 'leave', 'half-day']).withMessage('Invalid status'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
  ],
  delete: [
    param('id').isInt({ min: 1 }).withMessage('Invalid attendance ID'),
  ],
  getById: [
    param('id').isInt({ min: 1 }).withMessage('Invalid attendance ID'),
  ],
  query: [
    query('employeeId')
      .optional()
      .isInt({ min: 1 }).withMessage('Invalid employee ID'),
    query('startDate')
      .optional()
      .isISO8601().withMessage('Invalid start date format'),
    query('endDate')
      .optional()
      .isISO8601().withMessage('Invalid end date format'),
    query('status')
      .optional()
      .isIn(['present', 'absent', 'leave', 'half-day']).withMessage('Invalid status'),
  ],
};
