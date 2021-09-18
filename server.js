const express = require('express');
const app = express();
const path = require('path');
const SocketMethods = require('./server/SocketMethods');

app.use(express.static(path.join(__dirname, 'build')));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

const cors = {
    cors: [
      {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    ]
  }

const port = 4000;
const server = app.listen(port, function () {
    console.log(`Running on port ${port}`);
})

const io = new SocketMethods(server, cors)
