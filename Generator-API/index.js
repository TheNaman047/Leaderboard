const express = require('express'),
    app = express(),
    config = require('./configs/server')

// For parsing request body with JSON
// app.use(express.json())

// Routes
const bet = require('./routes/bet')

// Setting it up
app.use('/api/bet', bet)

// Starting Server
app.listen(config.port, () => console.log("Server is up and running"))