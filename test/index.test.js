'use strict'
const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyCE = require('../index')

test('Should load correctly the plugin', t => {
  t.plan(1)
  const app = Fastify()
  app.register(fastifyCE)
  app.ready(t.error)
})

test('', async t => {
  t.plan(1)
  const app = Fastify()

  app.register(fastifyCE, {
  })

  app.get('/async-throw', async () => {
    throw new Error('async-throw')
  })

  app.get('/async-throw-obj', async () => {
    // eslint-disable-next-line
    throw { custom: 'error' }
  })

  app.get('/async-send', async (request, reply) => {
    reply.send(new Error('async-send'))
  })

  app.get('/async-send-obj', async (request, reply) => {
    reply.code(403).send({ custom: 'error' })
  })

  app.get('/sync-send', async (request, reply) => {
    reply.send(new Error('async-send'))
  })

  app.get('/sync-send-obj', async (request, reply) => {
    reply.code(403).send({ custom: 'error' })
  })

  app.get('/validation-error', {
    schema: {
      querystring: {
        foo: { type: 'string', enum: ['bar'] }
      }
    }
  }, () => {})

  let res
  res = await app.inject('/async-throw')
  res = await app.inject('/async-throw-obj')
  res = await app.inject('/async-send')
  res = await app.inject('/async-send-obj')
  res = await app.inject('/sync-send')
  res = await app.inject('/sync-send-obj')
  res = await app.inject('/validation-error')

  t.equal(res.statusCode, 500)
})
