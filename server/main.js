const express = require('express');
const compress = require('compression');

const app = express();

// Apply gzip compression
app.use(compress());
app.use(express.static('/'));

module.exports = app;
