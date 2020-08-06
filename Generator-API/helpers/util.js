/* Calculates win amount based on bet amount */
exports.betCalculator = (betAmount) => {

    let transactionId = this.getRandomValue(6, 'aA#')

    let winAmount = 0

    const randomValue = Math.random()
    const winCriteria = (randomValue * 1000)

    // console.log(winCriteria);

    if (betAmount > winCriteria) {
        winAmount += randomValue > 0.5 ? (betAmount + (winCriteria / 10)) : (betAmount - (winCriteria / 10))
    }
    return { transactionId, winAmount }
}

/* Generates random value based on output length and selected characters */
exports.getRandomValue = (length, chars) => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
