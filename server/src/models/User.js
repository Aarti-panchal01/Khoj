const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false }, // Don't return by default
    phone: { type: String, required: true },
    college: { type: String, required: true, index: true },
    campus: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for common queries
userSchema.index({ email: 1, college: 1 });

module.exports = mongoose.model('User', userSchema);
