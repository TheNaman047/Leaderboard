// Clustering node server for load testing

const cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    express = require('express'),
    app = express(),
    config = require('./configs/server')

// Checking if runtime is requested to be clustered
const cliArgs = process.argv.slice(2),
    doCluster = cliArgs[0] === "--clustered" ? true : false

if (doCluster && cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    initServer()
}

function initServer() {

    // Routes
    const bet = require('./routes/bet')

    // Setting it up
    app.use('/api/bet', bet)

    // Starting Server
    app.listen(config.port, () => console.log("Server is up and running on http://localhost:" + config.port))
}