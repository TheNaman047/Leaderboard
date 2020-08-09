/**
 * @abstract Read payload from rabbitmq and store data in redis after calculating XP
 */
const rabbitMQConsumer = require('./helpers/rabbitmqConsumer'),
    utilHelper = require('./helpers/util'),
    redis = require('redis'),
    redisConfig = require('./configs/redisConfig'),
    redisClient = redis.createClient(redisConfig)

redisClient.on('ready', () => {

    console.log("Connected to Redis");
    // Reading messages from rabbitmq
    rabbitMQConsumer.getMessages(payload => {

        const parsedPayload = JSON.parse(payload.content.toString())

        // Calculating xp points
        const xpPoints = utilHelper.xpCalculator(parsedPayload["betAmount"], parsedPayload["winAmount"])

        parsedPayload["xpPoints"] = xpPoints
        console.log("Payload: ", parsedPayload)

        // Removing user from payload it reduce redundant data insertion in redis
        const userName = parsedPayload.user
        delete parsedPayload.user

        // Storing user score in sorted set of redis with key "redisConfig.leaderBSetKey" from config
        // and game id to diffrentiate leaderboards on per game basis
        redisClient.zadd(redisConfig.leaderBSetKey + ":" + parsedPayload.gameId, parsedPayload.xpPoints, userName)
        // Storing user data in hash for later use
        redisClient.hset(redisConfig.leaderBDataHashKey + ":" + parsedPayload.gameId, userName, JSON.stringify(parsedPayload))

    })
})

redisClient.on('error', (error) => {
    console.error('error', error);
    process.exit()
})