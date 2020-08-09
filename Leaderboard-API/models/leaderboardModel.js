const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    leaderboardSchema = new Schema({}, {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        strict: false
    }),
    LeaderboardModel = mongoose.model('leaderboard_dump', leaderboardSchema)

LeaderboardModel.dumpData = (dumpData) => {

    let insertData = {
        [parseDate(new Date())]: dumpData
    };

    function parseDate(date) {
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    }
    
    try {
        var data = new LeaderboardModel(insertData);
        data.save();
        return data;
    } catch (error) {
        console.error(error);
        return { status: 500, error: error.message }
    }
};

module.exports = LeaderboardModel;