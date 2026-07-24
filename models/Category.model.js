const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name must be at most 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '#3B82F6',
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

categorySchema.index({ name: 1, createdBy: 1 }, { unique: true });

function excludeArchived(next) {
  if (this.getFilter().archived === undefined) {
    this.where({ archived: { $ne: true } });
  }
  next();
}
categorySchema.pre(/^find/, excludeArchived);

module.exports = mongoose.model('Category', categorySchema);
