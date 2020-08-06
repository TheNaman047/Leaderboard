# Leaderboard API

This repo is implementaion of task provided by ScaleTech. Below are the task points.

We need to develop a micro service that should calculate the user's ranking similar to Leaderboard for the win amount they get.

1. Data is generated from any micro service & pushed to RabbitMQ message broker.

2. Data generated which is pushed to RabbitMQ is
userId, gameId, transactionId, betAmount, winAmount

win amount will be 0 if user lose & win amount will be greater than 0 if user wins. 

3. There would be Consumer (Leaderboard) Micro Service that would consume the event from RabbitMq & process this data & store it in its own database. 

You can think of XP point when user wins. It should be proportional not just to win amount but consider bet amount what user placed.

Higher the XP point, higher the ranking.

For now consider weekly leaderboard.
At the end of week, all the data should be flushed and logged in any other storage (s3, database or any other option you think is good)

4. Leaderboard stats should be available via API. also user who makes a request should be able to see own position.

5. As we need to consider handling  data at scale, we should at least consider processing 10k concurrent events per second & benchmark our results with load testing with different configuration with vCPU. 

Choose your preferred set of components like database, cache mechanism & and how you execute this task.

## Implementation

Generator-API node server pushes generated data to RabbitMQ. It calculates the transaction id and win amount.

## Load Testing

Load testing for Generator-API is done using "autocannon" npm package.
Test command: `` autocannon -c200 -p120 -d20 localhost:3001/api/bet ``
Node run command: `` npm run clustered ``
