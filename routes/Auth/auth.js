import S from 'fluent-json-schema'
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';

export default async function auth (fastify, opts) {
  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {secret: 'a secret with minimum length of 32 characters'});
  fastify.addHook('preHandler',fastify.logging)
  const { httpErrors, jwt } = fastify

  fastify.route({
    method: 'POST',
    path: '/auth',
    schema: {
      body: S.object()
        .prop('username', S.string().required())
        .prop('password', S.string().minLength(8).required())
        .additionalProperties(false)
    },
    handler: onAuth
  })

  async function onAuth (req, reply) {

    console.log(req.session);
    const { username, password } = req.body
    if (username !== fastify.CONFIGDB.username_fe || password !== fastify.CONFIGDB.password_fe) {
      throw httpErrors.unauthorized('Bad username or password')
    }
    const token = jwt.sign({ username })
    const sessionId= req.session.sessionId;
    reply.code(201)
    return { token , sessionId}
  }
}
