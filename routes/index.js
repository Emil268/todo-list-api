const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const todoRoutes = require('./todo.routes');
const activityLogRoutes = require('./activityLog.routes');
const externalRoutes = require('./external.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/todos', todoRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/external', externalRoutes);

module.exports = router;
