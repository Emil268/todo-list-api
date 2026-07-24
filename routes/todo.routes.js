const express = require('express');
const todoController = require('../controllers/todo.controller');
const validate = require('../middlewares/validator.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  createTodoValidation,
  updateTodoValidation,
  todoIdParamValidation,
  listTodoQueryValidation,
} = require('../validations/todo.validation');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Manage todos (owned per authenticated user)
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for the authenticated user (paginated, sortable, filterable, searchable)
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: field
 *         schema: { type: string, example: createdAt }
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category ObjectId
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in-progress, completed] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search keyword across title & description
 *     responses:
 *       200: { description: Todos fetched successfully }
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [pending, in-progress, completed] }
 *               priority: { type: string, enum: [low, medium, high] }
 *               dueDate: { type: string, format: date-time }
 *               category: { type: string }
 *     responses:
 *       201: { description: Todo created successfully }
 */
router
  .route('/')
  .get(listTodoQueryValidation, validate, todoController.getAllTodos)
  .post(createTodoValidation, validate, todoController.createTodo);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Todo fetched successfully }
 *       404: { description: Todo not found }
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Todo updated successfully }
 *       404: { description: Todo not found }
 *   delete:
 *     summary: Soft-delete (archive) a todo by ID
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Todo deleted (archived) successfully }
 *       404: { description: Todo not found }
 */
router
  .route('/:id')
  .get(todoIdParamValidation, validate, todoController.getTodoById)
  .put(updateTodoValidation, validate, todoController.updateTodo)
  .delete(todoIdParamValidation, validate, todoController.deleteTodo);

module.exports = router;
