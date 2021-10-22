import { join } from 'desm'
import AutoLoad from 'fastify-autoload'
import Sensible from 'fastify-sensible'


export default async function app (fastify, opts) {

//Definizione Schema di errore
    fastify.addSchema({
    $id: 'errorCustom',
    type: 'object',
    properties: {
      statusCode:{type :'number'},
      error: { type: 'string' },
      message:{ type: 'string' }

    }
  })




  fastify.register(Sensible)

  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins')
  })

  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes')
  }  )

}
