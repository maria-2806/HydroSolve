const mongoose = require('mongoose');

// Define the Issue schema
const issueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  contact: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  cloudinary_id: {
    type: String,
    default: null, // Store image reference (if applicable)
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['resolved', 'unresolved', 'in progress'], // Include "in progress"
    default: 'unresolved', // Default to "unresolved"
  },
});

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;
