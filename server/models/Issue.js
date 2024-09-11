// src/models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, 
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true, 
    maxlength: [30, 'Subject cannot be more than 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  severity: {
    type: Number,
    required: [true, 'Severity is required'], 
    min: [1, 'Severity must be at least 1'], 
    max: [10, 'Severity cannot exceed 10'], 
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true, 
  },
  date: {
    type: Date,
  },
  cloudinary_id: {
    type: String,
    
  },


});

const Issue = mongoose.model('Issue', issueSchema);


module.exports = Issue;
