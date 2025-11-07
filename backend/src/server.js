import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";
import itineraryRoutes from "./routes/itineraries.route.js";
import itineraryDaysRoute from "./routes/itinerary_days.route.js";
import { testDatabaseConnection } from "./config/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/itinerary_days", itineraryDaysRoute);



app.listen(PORT, () => {
  testDatabaseConnection();
  console.log(`Server running on port ${PORT}`);
});