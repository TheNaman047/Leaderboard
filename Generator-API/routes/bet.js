/**
 * @abstract API to generate bet data based on input. Then pushes
 * generated payload to rabbitmq to be processed further
 */

const router = require('express').Router(),
    rabbitMQHelper = require('../helpers/rabbitmqProducer'),
    { betCalculator } = require('../helpers/util'),
    randomWords = require('random-words')

router.get('/', (req, res) => {

    /* const { user, gameId } = req.query
    let betAmount = +req.query.betAmount */

    // For load testing
    const user = randomWords()
    const gameId = "1"
    const betAmount = Math.floor(Math.random() * 1000)

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