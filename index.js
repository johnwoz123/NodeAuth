//main starging point of the applicaiton
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//DB setup
//creates a new db called auth
mongoose.connect('mongodb://localhost:auth/auth')

// App setup
//  morgan and bodyParser are middleware
app.use(morgan('combined'));
app.use(bodyParser.json({
  type: '*/*'
}));

router(app);



// server setup - node index.js
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on:', port);
