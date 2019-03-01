// redis/index.js
const redis = require('redis')
const config = require('../config')

class RedisSubscriber {
  constructor() {
    this.client = redis.createClient(config.redis.port, config.redis.host)
    this.client.config("SET", "notify-keyspace-events", "KEA");
    this.keyChangeCb = () => {}
    this.eventChangeCb = () => {}

    this.client.on('message', (channel, message) => {
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

  subscribeToKey (key) {
    this.client.subscribe(`__keyspace@0__:${key}`)
  }
  
  subscribeToEvent (event) {
    this.client.subscribe(`__keyevent@0__:${event}`)
  }

  handleKeyChange (key, event) {
    this.keyChangeCb(key, event)
  }

  handleEventChange (event, key) {
    this.eventChangeCb(event, key)
  }

  onKeyChange(cb) {
    this.keyChangeCb = cb
  }
  
  onEventChange(cb) {
    this.eventChangeCb = cb
  }
}

module.exports = RedisSubscriber;