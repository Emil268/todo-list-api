const express = require('express');
const requireApiKey = require('../middlewares/apiKey.middleware');
const catchAsync = require('../utils/catchAsync');
const Todo = require('../models/Todo.model');
const Category = require('../models/Category.model');

const router = express.Router();

// Everything under /external requires a valid `x-api-key` header instead of a JWT.
router.use(requireApiKey);

/**
 * @swagger
 * tags:
 *   name: External
 *   description: Machine-to-machine endpoints protected by API Key (no JWT required)
 */

/**
 * @swagger
 * /external/stats:
 *   get:
 *     summary: Get aggregate statistics (for external systems / monitoring)
 *     tags: [External]
 *     security: [{ apiKeyAuth: [] }]
 *     responses:
 *       200: { description: Stats fetched successfully }
 *       401: { description: API key missing }
 *       403: { description: Invalid API key }
 */
router.get(
  '/stats',
  catchAsync(async (req, res) => {
    const [totalTodos, completedTodos, totalCategories] = await Promise.all([
      Todo.countDocuments({ archived: false }),
      Todo.countDocuments({ archived: false, status: 'completed' }),
      Category.countDocuments({ archived: false }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistics fetched successfully.',
      data: { totalTodos, completedTodos, totalCategories },
    });
  })
);

module.exports = router;
