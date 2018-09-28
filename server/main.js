const express = require('express');
const compress = require('compression');
const http = require('http');

const app = express();

// Apply gzip compression
app.use(compress());
app.use(express.static('.'));

http.createServer(app).listen(80);
