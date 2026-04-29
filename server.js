const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

console.log("MONGO_URI =", process.env.MONGO_URI);

connectDB();

const app = express();

app.use(express.json());

app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

app.get("/", (req, res) => {
  res.send("Server Working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});