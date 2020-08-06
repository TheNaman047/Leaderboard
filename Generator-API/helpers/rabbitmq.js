/**
 * @abstract Helper function. Sends payload to job queue via amqp channel
 */
const amqpChannel = require('./channel')

module.exports = async (data) => {

    amqpChannel(async (channel) => {
        try {

            await channel.assertQueue("jobs");
            channel.sendToQueue("jobs", Buffer.from(JSON.stringify(data)))
            // console.log(`Job sent successfully ${data.user}`);
        }
        catch (ex) {
            console.error(ex)
        }
    })
}