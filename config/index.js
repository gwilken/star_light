// config/index.js
const config = {
  app: {
    port: 8000
  },
  db: {
    name: 'starlight',
    collection: 'users',
    host: '127.0.0.1',
    port: 27017,
  },
  redis: {
    port: 6379,
    host: 'localhost',
  },
  ws: {
    port: 9090,
    strictOriginChecking: true
  },
  tokens: {
    expire: 60 
  }
}

module.exports = config;