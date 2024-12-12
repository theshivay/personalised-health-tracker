const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const recordRoutes = require('./routes/records.js');
require('dotenv').config();

const app = express();

const SECRET_KEY = "qaAbbcbdsAbxbs";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const DB_URL = process.env.MONGO_URL;

// MongoDB Connection
mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("Profile", userSchema);

// Routes
app.use('/api/records', recordRoutes);

// Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true, user: { name, email } });
  } catch (err) {
    res.status(400).json({ success: false, message: "Email already exists." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  res.json({ success: true, user: { name: user.name, email: user.email } });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
