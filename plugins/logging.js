import fp from 'fastify-plugin'


async function logging (fastify, opts) {

    fastify.decorate('logging', onLogging)

    async function onLogging (req, reply) {
        if (req.body) {
            req.log.info({ body: req.body }, 'parsed body')
        }
    }
}

export default fp(logging)
