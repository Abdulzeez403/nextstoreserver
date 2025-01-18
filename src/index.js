const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./connections/dbConfig");
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

app.use((req, res, next) => {
  console.log(`Request size: ${req.headers["content-length"]}`);
  next();
});

connectDB();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
