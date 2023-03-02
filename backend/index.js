// Import required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const mongodbURL = process.env.mongodbURL;
const port = process.env.port || 8080;

// Create a new Express.js app
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');  
  next();
});

// Configure body-parser middleware to handle JSON data
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a MongoDB schema for rooms
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
});

// Create a MongoDB model for rooms
const Room = mongoose.model("Room", roomSchema);

// Create a MongoDB schema for bookings
const bookingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    roomNumber: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    paymentType: { type: String, required: false },
    tip: { type: Number, required: false },
  },
  { timestamps: true }
);

// Create a MongoDB model for bookings
const Booking = mongoose.model("Booking", bookingSchema);

//Default route
app.get("/", (req, res) => {
  res.send("The backend server is working!");
});

// Define routes for rooms and bookings
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/rooms/:roomNumber", async (req, res) => {
  try {
    const room = await Room.findOne({ roomNumber: req.params.roomNumber });
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/bookings/:id", async (req, res) => {
  try {
    const book = await Booking.findOne({ _id: req.params.id });
    if(book){
    res.json(book);
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
} catch (err) {
  res.status(500).json({ message: err.message });
}
});

app.post("/rooms", async (req, res) => {
  const room = new Room({
    roomNumber: req.body.roomNumber,
    roomType: req.body.roomType,
    pricePerHour: req.body.pricePerHour,
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("roomNumber");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/bookings", async (req, res) => {
  const room = await Room.findOne({ roomNumber: req.body.roomNumber });
  const existingBooking = await Booking.findOne({
    roomNumber: req.body.roomNumber,
    startTime: { $lt: req.body.endTime },
    endTime: { $gt: req.body.startTime },
  });
  if (existingBooking) {
    res.status(400).json({ message: "Room is already booked" });
  } else if (!room) {
    res.status(400).json({ message: "Room does not exist" });
  } else {
    const booking = new Booking({
      userEmail: req.body.userEmail,
      roomNumber: req.body.roomNumber,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      price: req.body.price,
      paymentType: req.body.paymentType,
      tip: req.body.tip,
    });
    try {
      const newBooking = await booking.save();
      res.status(201).json(newBooking);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

app.put("/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
  } else {
    const room = await Room.findOne({ roomNumber: req.body.roomNumber });
    const existingBooking = await Booking.find({
      roomNumber: req.body.roomNumber,
      startTime: { $lt: req.body.endTime },
      endTime: { $gt: req.body.startTime },
    });
    console.log(existingBooking);
    if (existingBooking.length > 1) {
      res.status(400).json({ message: "Room is already booked" });
    } else if (!room) {
      res.status(400).json({ message: "Room does not exist" });
    } else {
      try {
        const newBooking = await booking.updateOne({ $set: req.body });
        res.status(201).json(newBooking);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  }
});

app.delete("/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
  } else {
    try {
      await booking.deleteOne();
      res.json({ message: "Booking deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
