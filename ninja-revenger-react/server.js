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
        console.log(data);
        const pyPort = 3700
        const url = 'https://localhost:/' + pyPort + '/endpoint'; // Replace with your server URL
        console.log(url);
        // const data = { message: 'Hello, Flask!' } // Replace with your string data

        axios.post(url, data)
            .then(response => {
                console.log(response.data); // Print the response from the server
            })
            .catch(error => {
                console.error(error);
            });
    })

});

const port = process.env.PORT || 4000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));