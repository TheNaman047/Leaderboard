const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    mongoConfig = require('./configs/mongoConfig'),
    serverConfig = require('./configs/server'),
    leaderboardRoute = require('./routes/leaderboard'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length

// Checking if runtime is requested to be clustered
const cliArgs = process.argv.slice(2),
    doCluster = cliArgs[0] === "--clustered" ? true : false

if (doCluster && cluster.isMaster) {

    // Needs to be called here to schedule job in master only
    initRedis()

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    initRedis()
    initServer(doCluster ? serverConfig.clustered_port : serverConfig.port)
}

function initRedis() {
    // Requiring redis handler for connection
    require('./handlers/redisHandler').init()
    // Scheduling cron task
    require('./cron/dumpDataJob')
}

function initServer(port) {

    // Connect to mongoose
    mongoose.connect(`mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(
        () => {
            console.log(`Mongo Has been connected successfully`);
        },
        err => {
            console.warn('Error while connecting Mongo');
            console.error(err);
        }
    ).catch(err => logger.error(err));

    // Setting up routes
    app.use('/api/leaderboard', leaderboardRoute)

    // Starting Server
    app.listen(port, () => console.log("Server is up and running on http://localhost:" + port))
}