// redis/RedisClient.js
const redis = require('redis')
const { promisify } = require('util')
const config = require('../config')

class RedisClient {
  constructor() {
    this.client = redis.createClient(config.redis.port, config.redis.host)
    this.zrange = promisify(this.client.zrange).bind(this.client)
    this.zrangebyscore = promisify(this.client.zrangebyscore).bind(this.client)
    this.zrevrange = promisify(this.client.zrevrange).bind(this.client)
    this.asyncHget = promisify(this.client.hget).bind(this.client)
    this.asyncHgetall = promisify(this.client.hgetall).bind(this.client)
  }

  getHashsFromSet (set, start = -30, end = -1) {
    return new Promise( async (resolve, reject) => {
        let list = await this.zrange(set, start, end)

        let res = list.map(async (key) => {
          return await this.asyncHgetall(key)
        })

        Promise.all(res).then( (docs) => {
          resolve(docs)
        })
    })
  }

  getHashsFromSetByScore (set, start, end) {
    return new Promise( async (resolve, reject) => {
        let list = await this.zrangebyscore(set, start, end)

        let res = list.map(async (key) => {
          return await this.asyncHgetall(key)
        })

        Promise.all(res).then( (docs) => {
          resolve(docs)
        })
    })
  }

  quit () {
    this.client.quit()
  }
}

module.exports = RedisClient;