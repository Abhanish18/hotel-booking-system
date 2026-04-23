 import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("GET bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Incoming booking body:", req.body);

    const { userName, userEmail, room, checkIn, checkOut } = req.body;

    if (!userName || !userEmail || !room || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (end <= start) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    const overlapping = await Booking.findOne({
      room,
      status: "booked",
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });

    if (overlapping) {
      return res.status(400).json({ message: "Room not available for selected dates" });
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((end - start) / millisecondsPerDay);
    const totalAmount = nights * 100;

    const booking = await Booking.create({
      userName,
      userEmail,
      room,
      checkIn: start,
      checkOut: end,
      totalAmount,
      status: "booked"
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (err) {
    console.error("POST bookings error:", err);
    res.status(500).json({ message: "Server error while creating booking" });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

export default router;