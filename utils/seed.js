/* eslint-disable no-console */
/**
 * Database seeder.
 *
 * Usage:
 *   npm run seed          -> seeds the database
 *   npm run seed -- --clear -> clears all seedable collections instead
 */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Todo = require('../models/Todo.model');
const ActivityLog = require('../models/ActivityLog.model');

const CATEGORY_SEED = [
  { name: 'Work', description: 'Tasks related to work and career', color: '#3B82F6' },
  { name: 'Personal', description: 'Personal errands and self-care', color: '#10B981' },
  { name: 'Study', description: 'Learning and educational goals', color: '#F59E0B' },
];

const TODO_TEMPLATES = {
  Work: [
    { title: 'Prepare quarterly report', priority: 'high', status: 'pending' },
    { title: 'Review pull requests', priority: 'medium', status: 'in-progress' },
    { title: 'Team stand-up meeting', priority: 'low', status: 'completed' },
  ],
  Personal: [
    { title: 'Grocery shopping', priority: 'low', status: 'pending' },
    { title: 'Book dentist appointment', priority: 'medium', status: 'pending' },
    { title: 'Morning workout', priority: 'medium', status: 'completed' },
  ],
  Study: [
    { title: 'Finish Node.js course module 3', priority: 'high', status: 'in-progress' },
    { title: 'Read chapter 5 of system design book', priority: 'medium', status: 'pending' },
    { title: 'Practice MongoDB aggregation queries', priority: 'high', status: 'pending' },
  ],
};

const connect = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log(`[Seeder] Connected to ${env.MONGO_URI}`);
};

const clearData = async () => {
  await Promise.all([
    Todo.deleteMany({}),
    Category.deleteMany({}),
    ActivityLog.deleteMany({}),
    User.deleteMany({ email: { $in: ['admin@example.com', 'user@example.com'] } }),
  ]);
  console.log('[Seeder] Existing seed data cleared.');
};

const seedUsers = async () => {
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    admin.createdBy = admin._id;
    await admin.save();
    console.log('[Seeder] Admin user created: admin@example.com / Admin@123');
  }

  let user = await User.findOne({ email: 'user@example.com' });
  if (!user) {
    user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'User@123',
      role: 'user',
      createdBy: admin._id,
    });
    console.log('[Seeder] Regular user created: user@example.com / User@123');
  }

  return { admin, user };
};

const seedCategoriesAndTodos = async (owner) => {
  const createdCategories = [];

  for (const cat of CATEGORY_SEED) {
    let category = await Category.findOne({ name: cat.name, createdBy: owner._id });
    if (!category) {
      category = await Category.create({ ...cat, createdBy: owner._id });
      console.log(`[Seeder] Category created: ${category.name}`);
    }
    createdCategories.push(category);

    const todos = TODO_TEMPLATES[cat.name] || [];
    for (const todoTemplate of todos) {
      const existing = await Todo.findOne({
        title: todoTemplate.title,
        user: owner._id,
        category: category._id,
      });
      if (!existing) {
        await Todo.create({
          ...todoTemplate,
          description: `${todoTemplate.title} - seeded todo item.`,
          category: category._id,
          user: owner._id,
          createdBy: owner._id,
        });
      }
    }
    console.log(`[Seeder] Seeded ${todos.length} todos for category "${cat.name}"`);
  }

  return createdCategories;
};

const run = async () => {
  const shouldClear = process.argv.includes('--clear');

  await connect();

  if (shouldClear) {
    await clearData();
    console.log('[Seeder] Done clearing. Exiting.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const { user } = await seedUsers();
  await seedCategoriesAndTodos(user);

  console.log('[Seeder] Seeding completed successfully.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  console.error('[Seeder] Error while seeding:', err);
  await mongoose.disconnect();
  process.exit(1);
});
