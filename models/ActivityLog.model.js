const mongoose = require('mongoose');

const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE'],
      required: true,
    },
    entity: {
      type: String,
      enum: ['Todo', 'Category', 'User'],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ entity: 1, entityId: 1 });
activityLogSchema.index({ performedBy: 1, createdAt: -1 });

function excludeArchived(next) {
  if (this.getFilter().archived === undefined) {
    this.where({ archived: { $ne: true } });
  }
  next();
}
activityLogSchema.pre(/^find/, excludeArchived);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
