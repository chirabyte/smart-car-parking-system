const express = require("express"); // Import Express
const router = express.Router(); // Create Router

const Vehicle = require("../models/Vehicle"); // Import Vehicle model
const Slot = require("../models/Slot"); // Import Slot model


// Vehicle Entry API
router.post("/entry", async (req, res) => {
  try {
    const { vehicleNumber } = req.body; 

    const oldVehicle = await Vehicle.findOne({
      vehicleNumber,
      exitTime: null
    }); 

    if (oldVehicle) {
      return res.json({
        message: "Vehicle already inside parking"
      });
    }

    const freeSlot = await Slot.findOne({
      isOccupied: false
    }).sort({ slotNumber: 1 });

    if (!freeSlot) {
      return res.json({
        message: "No free slot available"
      });
    }

    freeSlot.isOccupied = true;
    await freeSlot.save();

    await Vehicle.create({
      vehicleNumber,
      slot: freeSlot._id
    }); 

    res.json({
      message: "Vehicle parked successfully",
      slotNumber: freeSlot.slotNumber
    });

  } catch (error) {
    res.json({ error: error.message }); 
  }
});


// Vehicle Exit API
router.post("/exit", async (req, res) => {
  try {
    const { vehicleNumber } = req.body; 

    const vehicle = await Vehicle.findOne({
      vehicleNumber,
      exitTime: null
    }).populate("slot");
    if (!vehicle) {
      return res.json({
        message: "Vehicle not found"
      });
    }

    vehicle.exitTime = new Date(); // Add exit time
    await vehicle.save();

    const slot = await Slot.findById(vehicle.slot._id); // Find slot
    slot.isOccupied = false; // Free slot
    await slot.save();

    res.json({
      message: "Vehicle exited successfully",
      slotFreed: slot.slotNumber
    });

  } catch (error) {
    res.json({ error: error.message }); 
  }
});


// Show Parked Vehicles API
router.get("/parked", async (req, res) => {
  const data = await Vehicle.find({
    exitTime: null
  }).populate("slot"); 

  res.json(data);
});


// Full Vehicle History API
router.get("/history", async (req, res) => {
  const data = await Vehicle.find().populate("slot"); 

  res.json(data);
});

module.exports = router; 