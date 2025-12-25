require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const uploadRoutes = require("./routes/upload.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/upload", uploadRoutes);
app.use("/search", searchRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
