/**
 * @abstract Helper function. Receives payload to job queue via amqp channel
 */
const amqpChannel = require('./getChannelHelper')

module.exports = {
    getMessages: async (messageCallback) => {

        amqpChannel(async (channel) => {
            try {

                await channel.assertQueue("jobs");
                channel.consume("jobs", payload => messageCallback(payload), {
                    noAck: true,
                    exclusive: true
                })
            }
            catch (ex) {
                console.error(ex)
            }
        })
    }
}