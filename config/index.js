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
    port: 9000,
    strictOriginChecking: true
  }
}

module.exports = config;