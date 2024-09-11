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

    // Respond with the token
    res.status(201).json({ token });
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

    // Respond with the token
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err); // Log the error details
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.post('/user/report',upload.single('image'),  async (req, res) => {
  const { name,subject, description, severity, contact, date } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Get image URL from Cloudinary

  // Validate input
  if (!name || !subject || !description || !severity || !contact ) {
    return res.status(400).json({ message: 'All fields are required: name, subject, description, severity, contact.' });
  }
  console.log('Received issue data:', { name, subject, description, severity, contact, date , imageUrl });


  try {
    // Create a new issue
    const newIssue = new Issue({
      name,
      subject,
      description,
      severity,
      contact,
      date,
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
