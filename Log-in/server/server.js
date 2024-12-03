const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const SECRET_KEY = "qaAbbcbdsAbxbs";

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/userDB")
.then(()=> console.log("MongoDB connected"))
.catch((err)=> console.error(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

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

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

