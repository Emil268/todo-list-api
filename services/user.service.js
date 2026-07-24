const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');

/**
 * Admin-only: list all users (paginated, searchable by name/email).
 */
const getAllUsers = async (query) => {
  const baseQuery = User.find();

  const features = new ApiFeatures(baseQuery, query)
    .search(['name', 'email'])
    .filter(['role'])
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([features.query, features.getMeta()]);
  return { data, meta };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw AppError.notFound('User not found.');
  return user;
};

/**
 * Admin-only: soft-delete (archive) a user account.
 */
const deleteUser = async (id, adminId) => {
  const user = await User.findByIdAndUpdate(
    id,
    { archived: true, updatedBy: adminId },
    { new: true }
  );
  if (!user) throw AppError.notFound('User not found.');
  return user;
};

module.exports = { getAllUsers, getUserById, deleteUser };
