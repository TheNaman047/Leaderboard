const redis = require('redis'),
    redisConfig = require('../configs/redisConfig')

let redisClient = null

process.on('exit', () => {
    redisClient ? redisClient.quit() : null
})

module.exports = {
    init: () => {

        redisClient = redis.createClient(redisConfig)

        redisClient.on('error', (error) => {
            // Logging error in case redis connection fail
            console.error('error', error);
            process.exit()
        })
    },

    getClient: () => redisClient
}