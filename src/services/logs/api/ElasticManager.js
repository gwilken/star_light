const { Client } = require('@elastic/elasticsearch')

class ElasticManager {
  constructor() {
    this.path = process.env.ELASTIC_PATH || 'http://localhost:9200'
    this.index = process.env.ELASTIC_INDEX || 'logs'
    this.client = new Client({ 
      node: `${this.path}`
    })
  }


  async bulkInsert(docs) {
    let body = docs.map(doc => {
      return {
        index: {
          _index: this.index,
        },
        doc
      }
    })

    // const body = dataset.flatMap(doc => [{ index: { _index: 'tweets' } }, doc])

    const { body: bulkResponse } = await this.client.bulk({ refresh: true, body })
  
    if (bulkResponse.errors) {
      console.log('ES bulk insert err:', bulkResponse.errors)
    }

    console.log('es bulkresponse:', bulkResponse)
  }

  
  async insertDoc(body) {
    log('[ LOGS ] - Inserting into Elastic.')
    await this.client.index({
      index: this.index,
      body
    })
  }


  async getLastKnownTimestamp() {
    await this.client.indices.refresh({ index: this.index })

    let res = null

    const { body } = await this.client.search({
      index: this.index,
      body: {
        _source: ["timestamp", "eventlog_id"],
        size: 1,
        sort: { "timestamp": "desc"},
        query: {
          match_all: {}
        }
      }
    })

    if (body.hits.hits.length > 0) {
      const { eventlog_id, timestamp } = body.hits.hits[0]._source
      res = {
          eventlog_id,
          timestamp
        }
      }

    return res
  }
}

const elasticManager = new ElasticManager()

module.exports = elasticManager
