import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// Increase payload size limit
app.use(express.json({ limit: "20mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(express.json()); // middleware for extrate data as json
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
  connectDB();
});
