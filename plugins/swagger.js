import fp from 'fastify-plugin'
import sw from 'fastify-swagger'


async function swagger (fastify, opts) {
    fastify.register(sw, {
        routePrefix: '/documentation',
        swagger: {
            info: {
                title: 'Documetazione API',
                description: 'documentazione API Athonet',
                version: '0.1.0'
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here'
            },
            host: '0.0.0.0',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [

            ],
            definitions: {
                Error: {
                    type: 'object',
                    required: ['message', 'error','status'],
                    properties: {
                        message: { type: 'string', format: 'uuid' },
                        error: { type: 'string' },
                        status: { type: 'number' }

                    }
                }
            },
            securityDefinitions: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header'
                }
            }
        },
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        exposeRoute: true
    })
}

export default fp(swagger)