require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('./models/User');
const Issue = require('./models/Issue');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'issue_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// Sign-up route
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, name: newUser.name });
  } catch (err) {
    console.error('Error during sign-up:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, name: user.name });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Report an issue route
app.post('/user/report', upload.single('image'), async (req, res) => {
  const { name, subject, description, severity, contact, date, location } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  if (!name || !subject || !description || !severity || !contact || !location) {
    return res.status(400).json({ message: 'All fields are required: name, subject, description, severity, contact, location.' });
  }

  try {
    const newIssue = new Issue({
      name,
      subject,
      description,
      severity,
      contact,
      date,
      location,
      cloudinary_id: imageUrl,
      status: 'unresolved', // Default status
    });

    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (err) {
    console.error('Error during issue reporting:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Fetch reports for the logged-in user
app.get('/user/reports', async (req, res) => {
  const { name } = req.query; // Fetch user name from query parameter

  if (!name) {
    return res.status(400).json({ message: 'Name is required to fetch reports.' });
  }

  try {
    const userReports = await Issue.find({ name }); // Filter by name

    // Respond with an empty array if no reports exist
    if (!userReports || userReports.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(userReports);
  } catch (err) {
    console.error('Error fetching user reports:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});




// Fetch all issues (for admin)
app.get('/admin/issues', async (req, res) => {
  try {
    const issues = await Issue.find();
    res.status(200).json(issues);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Update the status of an issue
app.patch('/admin/issues/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status
  if (!['resolved', 'unresolved', 'in progress'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Use "resolved", "unresolved", or "in progress".' });
  }

  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated issue
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    res.status(200).json(updatedIssue);
  } catch (err) {
    console.error('Error updating issue status:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.delete('/admin/issues/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    res.status(200).json({ message: 'Issue deleted successfully.', deletedIssue });
  } catch (err) {
    console.error('Error deleting issue:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
