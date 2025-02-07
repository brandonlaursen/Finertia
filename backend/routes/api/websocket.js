const express = require("express");
const router = express.Router();

const { websocketClient } = require("@polygon.io/client-js");

// create a websocket client using the polygon client-js library
const ws = websocketClient(
  process.env.STOCK_API_KEY2,
  "wss://delayed.polygon.io"
).stocks(); // 15-min delay websocket
// const ws = websocketClient(
//   process.env.STOCK_API_KEY2,
//   "wss://socket.polygon.io"
// ).stocks(); // real-time websocket

// register a handler to log errors
ws.onerror = (err) => console.log("Failed to connect", err);

// register a handler to log info if websocket closes
ws.onclose = (code, reason) => console.log("Connection closed", code, reason);

// register a handler when messages are received
ws.onmessage = (msg) => {
  // parse the data from the message
  const parsedMessage = JSON.parse(msg.data);
  console.log("parsedMessage:", msg);

  // wait until the message saying authentication was successful, then subscribe to a channel
  if (
    parsedMessage[0].ev === "status" &&
    parsedMessage[0].status === "auth_success"
  ) {
    console.log("Subscribing to the minute aggregates channel for ticker AAPL");
    ws.send(JSON.stringify({ action: "subscribe", params: "AM.AAPL" }));
    ws.send(JSON.stringify({ action: "subscribe", params: "T.AAPL" })); // For trade data
    ws.send(JSON.stringify({ action: "subscribe", params: "AM.AAPL" })); // For minute aggregates
    ws.send(JSON.stringify({ action: "subscribe", params: "A.AAPL" })); // For second aggregates
  }
};

// Route to fetch WebSocket data
router.get("/", (req, res) => {
  res.json("s");
});

module.exports = router;
