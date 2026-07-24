const express = require('express');
const activityLogController = require('../controllers/activityLog.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validator.middleware');
const { listActivityLogQueryValidation } = require('../validations/activityLog.validation');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: ActivityLogs
 *   description: Audit trail of todo/category create, update, and delete actions
 */

/**
 * @swagger
 * /activity-logs:
 *   get:
 *     summary: Get activity logs (admins see all, users see only their own)
 *     tags: [ActivityLogs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: entity
 *         schema: { type: string, enum: [Todo, Category, User] }
 *       - in: query
 *         name: action
 *         schema: { type: string, enum: [CREATE, UPDATE, DELETE] }
 *     responses:
 *       200: { description: Activity logs fetched successfully }
 */
router.get('/', listActivityLogQueryValidation, validate, activityLogController.getAllLogs);

module.exports = router;
