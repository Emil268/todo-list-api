const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

/**
 * Registers a new user, hashes the password (via model pre-save hook),
 * and returns the created user along with a signed JWT.
 */
const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict('An account with this email already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user',
  });

  user.createdBy = user._id;
  await user.save();

  const token = signToken(user._id);
  return { user, token };
};

/**
 * Authenticates a user with email + password and returns a signed JWT.
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw AppError.unauthorized('Incorrect email or password.');
  }

  const token = signToken(user._id);
  user.password = undefined;
  return { user, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw AppError.notFound('User not found.');
  return user;
};

module.exports = { register, login, getMe, signToken };
