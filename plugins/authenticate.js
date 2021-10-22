import fp from 'fastify-plugin'
import Jwt from 'fastify-jwt'

async function authenticate (fastify, opts) {
  fastify.register(Jwt, { secret: fastify.CONFIGDB.word_secret , expiresIn: '1h'  })

  fastify.decorate('authenticate', onAuthenticate)

  async function onAuthenticate (req, reply) {
    await req.jwtVerify()
  }
}

export default fp(authenticate)
