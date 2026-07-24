const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

const getAllUsers = catchAsync(async (req, res) => {
  const { data, meta } = await userService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    message: 'Users fetched successfully.',
    data: { users: data },
    meta,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User fetched successfully.',
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'User deleted (archived) successfully.',
    data: null,
  });
});

module.exports = { getAllUsers, getUserById, deleteUser };
