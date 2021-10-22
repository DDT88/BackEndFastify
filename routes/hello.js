import S from 'fluent-json-schema'

export default async function hello (fastify, opts) {

  fastify.addHook('onRequest', fastify.authenticate)
  fastify.addHook('preHandler',fastify.logging)

  fastify.route({
    method: 'GET',
    path: '/hello',
    schema: {
      response: {
        200: S.object()
          .prop('hello', S.string())
      }
    },
    handler: onHello
  })

  async function onHello (req, reply) {
   req.log.info('Esempio di Log')
    return { hello: req.user.username }
  }
}
