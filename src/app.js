require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const uploadRoutes = require("./routes/upload.routes");
const searchRoutes = require("./routes/search.routes");
const askRoutes = require("./routes/ask.routes");

const app = express(); // ✅ app MUST be created first

app.use(express.json());

// DB
connectDB();

// Routes
app.use("/upload", uploadRoutes);
app.use("/search", searchRoutes);
app.use("/ask", askRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("OpsMind AI Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
