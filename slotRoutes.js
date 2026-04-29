const express = require("express"); 
const router = express.Router(); 
const Slot = require("../models/Slot"); 


// Create Slots API
router.post("/create", async (req, res) => {
  try {
    const { total } = req.body; 

    await Slot.deleteMany({}); 

    let slots = []; 

    for (let i = 1; i <= total; i++) { 
      slots.push({
        slotNumber: i, 
        isOccupied: false 
      });
    }

    const result = await Slot.insertMany(slots); 

    res.json({
      message: "Slots created successfully", 
      inserted: result.length 
    });

  } catch (error) {
    res.json({
      error: error.message 
    });
  }
});


// Get All Slots API
router.get("/", async (req, res) => {
  try {
    const data = await Slot.find(); // Get all slots
    res.json(data); // Send slot data
  } catch (error) {
    res.json({ error: error.message }); // Show error
  }
});

module.exports = router; // Export router