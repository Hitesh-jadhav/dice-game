// const express = require("express");
// const cors = require("cors");
// const crypto = require("crypto");

// const app = express();
// const port = 3001; // Backend runs on port 3001

// // Middleware
// app.use(cors()); // Enable CORS for frontend-backend communication
// app.use(express.json()); // Parse JSON request bodies

// // POST endpoint for rolling dice
// app.post("/api/roll-dice", (req, res) => {
//   const { betAmount, currentBalance } = req.body;

//   // Validate input
//   if (!betAmount || betAmount <= 0 || betAmount > currentBalance) {
//     return res.status(400).json({ error: "Invalid bet amount" });
//   }

//   // Generate server components for provably fair system
//   const serverSeed = crypto.randomBytes(16).toString("hex");
//   const nonce = Date.now().toString();
//   const hash = crypto.createHash("sha256").update(serverSeed + nonce).digest("hex");

//   // Calculate the dice roll result
//   const hashPrefix = hash.substring(0, 8);
//   const randomValue = parseInt(hashPrefix, 16) / 0xFFFFFFFF;
//   const roll = Math.floor(randomValue * 6) + 1;

//   // Calculate the new balance
//   const newBalance = roll > 3 
//     ? currentBalance + betAmount 
//     : currentBalance - betAmount;

//   // Send response to the frontend
//   res.status(200).json({
//     newBalance,
//     roll,
//     serverSeed,
//     nonce,
//     hash,
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Backend server is running on http://localhost:${port}`);
// });


const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the "out" directory
app.use(express.static(path.join(__dirname, "../client/out")));

// POST endpoint for rolling dice
app.post("/api/roll-dice", (req, res) => {
  const { betAmount, currentBalance } = req.body;

  // Validate input
  if (!betAmount || betAmount <= 0 || betAmount > currentBalance) {
    return res.status(400).json({ error: "Invalid bet amount" });
  }

  // Generate server components for provably fair system
  const serverSeed = crypto.randomBytes(16).toString("hex");
  const nonce = Date.now().toString();
  const hash = crypto.createHash("sha256").update(serverSeed + nonce).digest("hex");

  // Calculate the dice roll result
  const hashPrefix = hash.substring(0, 8);
  const randomValue = parseInt(hashPrefix, 16) / 0xFFFFFFFF;
  const roll = Math.floor(randomValue * 6) + 1;

  // Calculate the new balance
  const newBalance = roll > 3 
    ? currentBalance + betAmount 
    : currentBalance - betAmount;

  // Send response to the frontend
  res.status(200).json({
    newBalance,
    roll,
    serverSeed,
    nonce,
    hash,
  });
});

// Handle all other routes (serve the frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/out/index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
