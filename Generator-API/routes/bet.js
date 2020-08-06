/**
 * @abstract API to generate bet data based on input. Then pushes
 * generated payload to rabbitmq to be processed further
 */

const router = require('express').Router()
const rabbitMQHelper = require('../helpers/rabbitmq')
const { betCalculator } = require('../helpers/util')

router.get('/', (req, res) => {

    /* const { user, gameId } = req.query
    let betAmount = +req.query.betAmount */

    // For load testing
     const user = "naman"
     const gameId = "1"
     const betAmount = 450

    // Validating input
    if (!user || !gameId || !betAmount) {
        return res.status(400).send(`{"message":"Missing input values"}`)
    }

    const betResults = betCalculator(betAmount)

    // Sending payload to MQ
    rabbitMQHelper({
        user,
        gameId,
        betAmount,
        ...betResults
    })

    res.status(200).send(`{"message":"Job queued"}`)
})

module.exports = router