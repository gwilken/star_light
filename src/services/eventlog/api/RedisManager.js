// redis/RedisManager.js
const redis = require('redis')
const { promisify } = require('util')
const log = require('./utils/log');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = process.env.REDIS_PORT || '6379'

class RedisManager {
  constructor() {
    this.subscribeClient = redis.createClient(REDIS_PORT, REDIS_HOST)
    this.subscribedKeys = {}
    this.subscribedEvent = {}

    this.publishClient = redis.createClient(REDIS_PORT, REDIS_HOST)
    this.zadd = promisify(this.publishClient.zadd).bind(this.publishClient)

    this.subscribeClient.config("SET", "notify-keyspace-events", "KEA");

    this.zrange = promisify(this.publishClient.zrange).bind(this.publishClient)
    this.zrangebyscore = promisify(this.publishClient.zrangebyscore).bind(this.publishClient)
    this.zrevrange = promisify(this.publishClient.zrevrange).bind(this.publishClient)
    this.zrevrangebyscore = promisify(this.publishClient.zrevrangebyscore).bind(this.publishClient)

    // this.asyncHget = promisify(this.subscribeClient.hget).bind(this.subscribeClient)
    // this.asyncHgetall = promisify(this.subscribeClient.hgetall).bind(this.subscribeClient)
  
    this.subscribeClient.on('ready', () => {
      log('[ EVENTLOG ] - Redis ready.')
    })

    this.subscribeClient.on('message', (channel, message) => {
      let [ type, data] = channel.split(':')
      
      switch (type) {
        case '__keyspace@0__':
          this.handleKeyChange(data, message)
        break;
        
        case '__keyevent@0__':
          this.handleEventChange(data, message)
        break;
      }
    })
  }


  publishToSet(msg) {
    this.zadd(msg.type, msg.timestamp, JSON.stringify(msg)  )
  }


  subscribeToKey (key, cb) {
    this.subscribeClient.subscribe(`__keyspace@0__:${key}`)
    this.subscribedKeys[key] = this.subscribedKeys[key] || []
    this.subscribedKeys[key].push(cb)
    
    log('[ EVENTLOG ] - Key subscribed to:', key)
  }
  

  subscribeToEvent (event) {
    this.subscribeClient.subscribe(`__keyevent@0__:${event}`)

    this.subscribedEvent[event] = this.subscribedEvent[event] || []
    this.subscribedEvent[event].push(cb)
    
    log('[ EVENTLOG ] - Event subscribed to:', event)
  }


  handleKeyChange (key, event) {
    if (this.subscribedKeys[key]) {
      this.subscribedKeys[key].forEach(cb => cb(event))
    }
  }


  handleEventChange (event, key) {
    if (this.subscribedEvent[event]) {
      this.subscribedEvent[event].forEach(cb => cb(key))
    }
  }


  getFromTimestamp(key, timestamp) {
    return new Promise( async (resolve, reject) => {
      let logs = await this.zrange(key, timestamp, '-1', 'WITHSCORES')
      resolve(logs)
    })
  }

  quit () {
    this.subscribeClient.quit()
    this.publishClient.quit()
  }
}

const redisManager = new RedisManager()

module.exports = redisManager
