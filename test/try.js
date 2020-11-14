const Fastify = require('fastify')
const fastifyCE = require('../index')

async function run () {
  const app = Fastify()

  app.register(fastifyCE, {
    rebrand: {
      statusCode: 'status',
      code: '',
      error: 'err',
      message: 'msg'
    }

  })

  app.get('/async-throw', async () => {
    const e = new Error('async-throw')
    e.code = 'ciao'
    e.lang = 'ciao'
    throw e
  })

  app.get('/validation-error/:foo', {
    schema: {
      params: {
        foo: { type: 'string', enum: ['bar'] }
      },
      response: {
        '5xx': {
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            code: { type: 'string' },
            error: { type: 'string' },
            lang: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, () => {})

  let res
  res = await app.inject('/async-throw')
  console.log(res.payload)
  // res = await app.inject('/async-throw-obj')
  // console.log(res.payload)
  // res = await app.inject('/async-send')
  // console.log(res.payload)
  // res = await app.inject('/async-send-obj')
  // console.log(res.payload)
  // res = await app.inject('/sync-send')
  // console.log(res.payload)
  // res = await app.inject('/sync-send-obj')
  // console.log(res.payload)
  // res = await app.inject('/validation-error/john')
  // console.log(res.payload)
}

run()
