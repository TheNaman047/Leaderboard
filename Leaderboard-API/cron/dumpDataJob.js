const cron = require('node-cron'),
    cronConfig = require('../configs/cronConfig'),
    redisConfig = require('../configs/redisConfig'),
    redisHandler = require('../handlers/redisHandler'),
    LeaderboardModel = require('../models/leaderboardModel'),
    cluster = require('cluster')

if (cluster.isMaster) {

    cron.schedule(cronConfig.everySunday, () => {

        console.log("cron job started");
        const redisClient = redisHandler.getClient()

        // Gameid is set static "1" for now
        const gameId = 1
        redisClient.zrevrange(redisConfig.leaderBSetKey + ":" + gameId, 0, -1, 'withscores', async (err, scores) => {

            if (err) console.error(err);

            let leaderboardData = []
            /* Mapping leaderboard data to proper json format
                Note: Below code can also be moved to client side by 
                          just passing the scores array returned by redis.
                          Also note that the (index + 1) of array specifies the
                          rank of that user in leaderboard
            */
            for (let index = 0; index < scores.length; index = index + 2) {
                leaderboardData.push({
                    [scores[index]]: scores[index + 1]
                })
            }

            const dumpData = {
                [gameId]: leaderboardData
            }
            // Dumping data in mongo db
            LeaderboardModel.dumpData(dumpData)

            // Removing data from redis
            redisClient.del(redisConfig.leaderBSetKey + ":" + gameId)
        })
    })
}