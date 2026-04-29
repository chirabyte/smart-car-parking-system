const mongoose = require("mongoose");  // Import Mongoose

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: String,             // Store vehicle number
  slot: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: "Slot"                              
  },
  entryTime: {
    type: Date,                             
    default: Date.now                      
  },
  exitTime: Date                     
});

module.exports = mongoose.model("Vehicle", vehicleSchema);     