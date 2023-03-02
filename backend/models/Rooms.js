const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    roomNumber: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
  });

module.exports = mongoose.model("Booking", bookingSchema);