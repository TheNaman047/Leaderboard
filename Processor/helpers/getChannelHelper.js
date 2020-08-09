/**
 * @abstract Helper module. Connects to rabbitmq and then creates a communication
 * channel. This module makes sure that only one connection and channel are created
 * for a single instance of server
 */
const amqp = require('amqplib')
const config = require('../configs/rabbitmq')

let channel, callback
const amqpServer = `amqp://${config.host}:${config.port}`

amqp.connect(amqpServer).then(async connection => {

    channel = await connection.createChannel();

    if (typeof callback === "function")
        callback(channel)
})

module.exports = function (cb) {
    if (typeof channel != 'undefined') {
        cb(channel);
    } else {
        callback = cb;
    }
}