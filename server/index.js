require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Issue = require('./models/Issue');
const app = express();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'issue_images', // Folder in Cloudinary to store images
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

const upload = multer({ storage });

// Sign-up route
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the specified role
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and name
    res.status(201).json({ token, name: newUser.name });
  } catch (err) {
    console.error('Error during sign-up:', err); // Log the error details
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and name
    res.status(200).json({ token, name: user.name });
  } catch (err) {
    console.error('Error during login:', err); // Log the error details
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Report an issue route
app.post('/user/report', upload.single('image'), async (req, res) => {
  const { name, subject, description, severity, contact, date, location } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Get image URL from Cloudinary

  // Validate input
  if (!name || !subject || !description || !severity || !contact || !location) {
    return res.status(400).json({ message: 'All fields are required: name, subject, description, severity, contact, location.' });
  }
  console.log('Received issue data:', { name, subject, description, severity, contact, date, location, imageUrl });

  try {
    // Create a new issue
    const newIssue = new Issue({
      name,
      subject,
      description,
      severity,
      contact,
      date,
      location, // Store the location
      cloudinary_id: imageUrl,
    });

    // Save the issue to the database
    await newIssue.save();

    // Respond with the created issue
    res.status(201).json(newIssue);
  } catch (err) {
    console.error('Error during issue reporting:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Fetch all issues (for admin)
app.get('/admin/issues', async (req, res) => {
  try {
    const issues = await Issue.find(); // Fetch all issues from the database
    res.status(200).json(issues); // Return the issues as JSON
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Update the status of an issue
// app.patch('/admin/issues/:id/status', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   // Validate the status
//   if (!['resolved', 'unresolved'].includes(status)) {
//     return res.status(400).json({ message: 'Invalid status value.' });
//   }

//   try {
//     // Update the issue status
//     const updatedIssue = await Issue.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true } // Return the updated issue
//     );

//     if (!updatedIssue) {
//       return res.status(404).json({ message: 'Issue not found.' });
//     }

//     res.status(200).json(updatedIssue); // Send back the updated issue
//   } catch (err) {
//     console.error('Error updating issue status:', err);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// });


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
