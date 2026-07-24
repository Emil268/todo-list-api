const ActivityLog = require('../models/ActivityLog.model');
const ApiFeatures = require('../utils/apiFeatures');

/**
 * Records an activity log entry. Designed to be "fire-and-forget"
 * safe: failures here should never break the main request flow,
 * so callers should wrap invocations in try/catch (or this function
 * can be awaited and errors simply logged).
 */
const record = async ({ action, entity, entityId, description, metadata = {}, performedBy }) => {
  try {
    await ActivityLog.create({
      action,
      entity,
      entityId,
      description,
      metadata,
      performedBy,
      createdBy: performedBy,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[ActivityLog] Failed to record activity: ${err.message}`);
  }
};

const list = async (query, filterBase = {}) => {
  const baseQuery = ActivityLog.find(filterBase).populate('performedBy', 'name email');

  const features = new ApiFeatures(baseQuery, query).filter(['entity', 'action']).sort().paginate();

  const [data, meta] = await Promise.all([features.query, features.getMeta()]);
  return { data, meta };
};

module.exports = { record, list };
