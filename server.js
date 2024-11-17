// Import dependencies
const WebSocket = require('ws');
const express = require('express');

// Initialize Express app
const app = express();

// Create an HTTP server that Express can use
const server = app.listen(process.env.PORT || 8081, () => {
    console.log('Server is running');
});

// Create WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Store all connected clients
const clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Add the new client to the clients array
    clients.push(ws);

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(`Server says: ${message}`);

        // Broadcast the message to all connected clients
        broadcast(message);
    });

    // Handle when client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
        // Remove the client from the clients array
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

// Function to broadcast a message to all clients
function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`Broadcast: ${message}`);
        }
    });
}

// Serve a simple response on the root route for HTTP requests
app.get('/', (req, res) => {
    res.send('WebSocket server is running!');
});
