// Import dependencies
const WebSocket = require('ws');
const express = require('express');

// Initialize Express app
const app = express();

// Create an HTTP server that Express can use
const server = app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running');
});

// Create WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(`Server says: ${message}`);
    });

    // Handle when client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Serve a simple response on the root route for HTTP requests
app.get('/', (req, res) => {
    res.send('WebSocket server is running!');
});