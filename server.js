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
let clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
    // Add the new client to the clients array
    clients.push(ws);

    const message = { "type": "number of players", "players": clients.length };
    broadcast(message);

    // Handle incoming messages
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        broadcast(data);
    });

    // Handle when client disconnects
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if ((index == 0) || (index == 1)) {
            const messageEnd = { "type": "end game", "win": null };
            broadcast(messageEnd);
        }
        if (index !== -1) {
            if (index !== 0 || clients.length <= 1) {
                clients.splice(index, 1);
            }
            else if (clients.length > 2) {
                clients[0] = clients[2];
                clients.splice(2, 1);
            }
            else {
                clients = [clients[1]];
            }
        }
        const message = { "type": "number of players", "players": clients.length };
        broadcast(message);
    });
});

// Function to broadcast a message to all clients
function broadcast(message) {
    for (let i = 0; i < clients.length; i++) {
        client = clients[i];
        if (client.readyState === WebSocket.OPEN) {
            message["id"] = i + 1;
            client.send(JSON.stringify(message));
        }
    };
}

// Serve a simple response on the root route for HTTP requests
app.get('/', (req, res) => {
    res.send('WebSocket server is running!');
});
