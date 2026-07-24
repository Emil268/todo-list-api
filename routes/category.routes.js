const express = require('express');
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validator.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdParamValidation,
  listCategoryQueryValidation,
} = require('../validations/category.validation');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manage todo categories (owned per authenticated user)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories owned by the authenticated user
 *     tags: [Categories]
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
 *     responses:
 *       200: { description: Categories fetched successfully }
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Work }
 *               description: { type: string }
 *               color: { type: string, example: "#3B82F6" }
 *     responses:
 *       201: { description: Category created successfully }
 */
router
  .route('/')
  .get(listCategoryQueryValidation, validate, categoryController.getAllCategories)
  .post(createCategoryValidation, validate, categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category fetched successfully }
 *       404: { description: Category not found }
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category updated successfully }
 *       404: { description: Category not found }
 *   delete:
 *     summary: Soft-delete (archive) a category by ID
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted (archived) successfully }
 *       404: { description: Category not found }
 */
router
  .route('/:id')
  .get(categoryIdParamValidation, validate, categoryController.getCategoryById)
  .put(updateCategoryValidation, validate, categoryController.updateCategory)
  .delete(categoryIdParamValidation, validate, categoryController.deleteCategory);

module.exports = router;
