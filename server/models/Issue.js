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
    type: String, // Add a new field to store the location as a string
    required: true,
  },
});

// Create and export the Issue model
const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;
