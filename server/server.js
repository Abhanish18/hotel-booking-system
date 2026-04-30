 import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/hotel_booking")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

 app.get("/", (req,res)=>{
 res.send("SERVER IS USING THIS FILE");
});

app.use("/api/bookings", bookingRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});