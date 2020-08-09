/* Calculates win amount based on bet amount */
module.exports = {
    xpCalculator: (betAmount, winAmount) => {

        const fourthOfBetAmt = parseFloat((betAmount * 0.25).toFixed(3))
        return winAmount ? fourthOfBetAmt + winAmount : fourthOfBetAmt
    }
}