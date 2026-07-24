const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: { user, token },
  });
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: { user, token },
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully.',
    data: { user },
  });
});

module.exports = { register, login, getMe };
