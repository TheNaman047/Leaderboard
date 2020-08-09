const router = require('express').Router(),
    redisConfig = require('../configs/redisConfig'),
    redisHandler = require('../handlers/redisHandler')

router.get('/getStats', (req, res) => {

    const user = req.query.user || "",
        offset = req.query.offset || 10,
        gameId = req.query.gameId || 1

    if (!user) return res.status(400).send("User parameter missing")

    // This object will held leaderboard data and user data
    let leaderBoardStats = {
        "leaderboard": [],
        "myRank": 0
    }

    // Fetching data from redis
    const redisClient = redisHandler.getClient()

    redisClient.zrevrange(redisConfig.leaderBSetKey + ":" + gameId, 0, offset, 'withscores', (err, scores) => {
        if (err) console.error(err);

        /* Mapping leaderboard data to proper json format
            Note: Below code can also be moved to client side by 
                      just passing the scores array returned by redis.
                      Also note that the (index + 1) of array specifies the
                      rank of that user in leaderboard
        */
        for (let index = 0; index < scores.length; index = index + 2) {
            leaderBoardStats.leaderboard.push({
                [scores[index]]: scores[index + 1]
            })
        }

        // Now fetching requested user rank
        redisClient.zrevrank(redisConfig.leaderBSetKey + ":" + gameId, user, (err, rank) => {
            leaderBoardStats.myRank = rank + 1

            // All process done, sending leaderboardstats back
            res.status(200).send(leaderBoardStats)
        })
    })
})

module.exports = router