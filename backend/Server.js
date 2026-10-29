
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("Authentication System API is running!");
});

// Protected profile API
app.get("/api/auth/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted! Token is valid.",
    userId: req.userId,
  });
});

// Login and Register APIs
app.use("/api/auth", authRoutes);

// Port
const PORT = process.env.PORT || 5001;

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });


