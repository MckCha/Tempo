import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import { testDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  testDatabaseConnection();
  console.log(`Server running on port ${PORT}`);
});