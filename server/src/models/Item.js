const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['found', 'lost'], required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    images: [{ type: String }],
    urgent: { type: Boolean, default: false },
    contactPreference: { type: String, enum: ['both', 'email', 'phone'], default: 'both' },
    status: { type: String, enum: ['active', 'resolved'], default: 'active', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },
    college: { type: String, required: true, index: true },
    campus: { type: String, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
itemSchema.index({ college: 1, createdAt: -1 });
itemSchema.index({ college: 1, type: 1, status: 1 });
itemSchema.index({ college: 1, category: 1 });
itemSchema.index({ college: 1, campus: 1 });

// Text index for search functionality
itemSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  category: 'text',
});

module.exports = mongoose.model('Item', itemSchema);
