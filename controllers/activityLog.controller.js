const catchAsync = require('../utils/catchAsync');
const activityLogService = require('../services/activityLog.service');

/**
 * Admins can view all activity logs; regular users only see logs
 * they personally performed.
 */
const getAllLogs = catchAsync(async (req, res) => {
  const filterBase = req.user.role === 'admin' ? {} : { performedBy: req.user.id };
  const { data, meta } = await activityLogService.list(req.query, filterBase);

  res.status(200).json({
    success: true,
    message: 'Activity logs fetched successfully.',
    data: { logs: data },
    meta,
  });
});

module.exports = { getAllLogs };
