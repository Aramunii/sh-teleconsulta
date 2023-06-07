const fs = require('fs')

const express = require("express");
const path = require("path");
const http = require("http");
const https = require('https')
const app = express();

const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/node-sign.supporthealth.com.br/fullchain.pem','utf8'),
    key: fs.readFileSync('/etc/letsencrypt/live/node-sign.supporthealth.com.br/privkey.pem','utf8')
}
const server = https.createServer(options,app);
// const server = http.createServer(app);
const io = require("socket.io")(server);

const signallingServer = require("./server/signalling-server.js");

// Get PORT from env variable else assign 3000 for development
const PORT = process.env.PORT || 30851;

// Server all the static files from www folder
app.use(express.static(path.join(__dirname, "www")));
app.use(express.static(path.join(__dirname, "icons")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "node_modules/vue/dist/")));

server.listen(PORT, null, () => {
	console.log("Tlk server started");
	console.log({ port: PORT, node_version: process.versions.node });
});



// serve the landing page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "www/index.html")));

// serve the terms / legal page
app.get("/legal", (req, res) => res.sendFile(path.join(__dirname, "www/legal.html")));

// All other URL patterns will serve the app.
app.get("/:room", (req, res) => res.sendFile(path.join(__dirname, "www/app.html")));

io.sockets.on("connection", signallingServer);
