'use strict'

const fp = require('fastify-plugin')
const FJS = require('fast-json-stringify')
const statusCodes = require('http').STATUS_CODES

function fastfiyCustomError (fastify, opts, next) {
  const serializeError = FJS({
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      code: { type: 'string' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  })

  fastify.setNotFoundHandler(function (request, reply) {
    const { url, method } = request.raw
    const message = `Route ${method}:${url} not found`
    request.log.info(message)
    reply.code(404).send({
      message,
      error: 'Not Found',
      statusCode: 404
    })
  })

  fastify.setErrorHandler(function (error, request, reply) {
    // Log error
    // Send error response
    const res = reply.res
    if (res.statusCode >= 500) {
      reply.log.error({ req: reply.request.raw, res: res, err: error }, error && error.message)
    } else if (res.statusCode >= 400) {
      reply.log.info({ res: res, err: error }, error && error.message)
    }
    reply.send(error)
    //

    // const statusCode = reply.statusCode
    // reply.send({
    //   error: statusCodes[statusCode + ''],
    //   code: error.code,
    //   message: error.message || '',
    //   statusCode: statusCode
    // })
  })

  next()
}

module.exports = fp(fastfiyCustomError, {
  fastify: '^2.x',
  name: 'fastify-custom-error'
})
