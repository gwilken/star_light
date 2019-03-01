// redis/index.js
const redis = require('redis')
const config = require('../config')

class RedisPublisher {
  constructor() {
    this.client = redis.createClient(config.redis.port, config.redis.host)
  //  this.client.config("SET", "notify-keyspace-events", "KEA");
  }

}

module.exports = RedisPublisher;