const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    roomType: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
  });

module.exports = mongoose.model("Room", roomSchema);