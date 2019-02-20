// redis/index.js
const redis = require('redis')
const config = require('../config/index.js')
const redisClient = redis.createClient(config.redis.port, config.redis.host)

redisClient.on('error', err => {
  console.log('[ REDIS ] - Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('[ REDIS ] - Connected to Redis succesfully.');
});

redisClient.on('ready', () => {
  console.log('[ REDIS ] - Redis Ready.');
});

module.exports = redisClient;