// backend/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  bio: { type: String, default: '' },
  skills: [{ type: String }],

  // --- ADD THESE NEW FIELDS ---
  education: {
    university: { type: String, default: '' },
    degree: { type: String, default: '' },
    graduationYear: { type: Number },
  },
  experience: [{ // Array to hold multiple experiences
    title: { type: String },
    company: { type: String },
    description: { type: String },
  }],
  portfolioLink: { type: String, default: '' },
  resumeLink: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);