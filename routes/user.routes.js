const express = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validator.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { userIdParamValidation, listUserQueryValidation } = require('../validations/user.validation');

const router = express.Router();

// Every route below requires a valid JWT AND the "admin" role.
router.use(protect, restrictTo('admin'));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin-only user management (demonstrates role-based access control)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [admin, user] }
 *     responses:
 *       200: { description: Users fetched successfully }
 *       401: { description: Not authenticated }
 *       403: { description: Forbidden — admin role required }
 */
router.get('/', listUserQueryValidation, validate, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User fetched successfully }
 *       403: { description: Forbidden — admin role required }
 *       404: { description: User not found }
 *   delete:
 *     summary: Soft-delete (archive) a user account (Admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted (archived) successfully }
 *       403: { description: Forbidden — admin role required }
 *       404: { description: User not found }
 */
router
  .route('/:id')
  .get(userIdParamValidation, validate, userController.getUserById)
  .delete(userIdParamValidation, validate, userController.deleteUser);

module.exports = router;
