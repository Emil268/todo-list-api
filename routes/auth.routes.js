const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validator.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration and authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: John Doe }
 *               email: { type: string, example: john@example.com }
 *               password: { type: string, example: secret123 }
 *               role: { type: string, enum: [admin, user] }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Validation error }
 *       409: { description: Email already exists }
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive a JWT access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: john@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200: { description: Logged in successfully }
 *       401: { description: Incorrect email or password }
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user fetched successfully }
 *       401: { description: Not authenticated }
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
