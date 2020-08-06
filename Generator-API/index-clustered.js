// Clustering node server for load testing

const cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    express = require('express'),
    app = express(),
    config = require('./configs/server')

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
}
else {
    // For parsing request body with JSON
    app.use(express.json())

    // Routes
    const bet = require('./routes/bet')

    // Setting it up
    app.use('/api/bet', bet)

    // Starting Server
    app.listen(config.clustered_port, () => console.log("Server is up and running"))
}