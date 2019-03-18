const express = require('express');
const compress = require('compression');
const http = require('http');

const PORT = process.env.PORT || 5000;

const app = express();

// Apply gzip compression
app.use(compress());
app.use(express.static('.'));
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const server = http.createServer(app).listen(PORT);

module.exports = server;
