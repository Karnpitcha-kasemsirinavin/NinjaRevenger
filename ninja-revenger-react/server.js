const axios = require('axios');
const express = require('express')
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log("connected", socket.id);

    console.log(' %s sockets connected', io.engine.clientsCount);

    socket.on("connect_error", () => {
        setTimeout(() => {
        socket.connect();
        }, 1000);
    });

    socket.on('data', data => {
        const pyPort = 3600
        const url = 'http://127.0.0.1:' + pyPort; // Replace with your server URL
        // console.log(url);
        // const data = { message: 'Hello, Flask!' } // Replace with your string data
        if (data.from) {
            axios.post(url, data)
            .then(response => {
                console.log(data.from, response.data['hand']); // Print the response from the server
                io.to(data.from).emit('hand', { hand: response.data['hand'] })
            })
            .catch(error => {
                console.error(error);
            });
        }
    })
});

const port = process.env.PORT || 4000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));