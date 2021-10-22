import Fastify from 'fastify'
import ConnectMongo from "./Model/db.js";
import config from "./Model/config.js";
import  loadSettings  from "./config/configurationAdaptor.js";
import nconf from 'nconf';
import * as fs from "fs";
import fastifyCors from 'fastify-cors'
import * as path from "desm";
import  split  from 'split2';
const stream = split(JSON.parse);
const fastify = Fastify({
    logger: {
        file: 'server.log',

        redact: ['req.headers.authorization'],
        level: 'info',
        serializers: {
            req (req) {
                return {
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    hostname: req.hostname,
                    remoteAddress: req.ip,
                    remotePort: req.socket.remotePort
                }
            }
        }
    },
    https: {
        key: fs.readFileSync('./config/cert/private.key'),
        cert: fs.readFileSync('./config/cert/public.crt')
    }

});

const appSettingsPath = process.env.APP_SETTINGS_FILE_PATH || "./config/appSettings.json";

 loadSettings({appSettingsPath})
    .then(async () => {
        //leggo le variabili dal file di configurazione e faccio connessione
        const mongoURI = nconf.get('db.mongodb.uri');
        ConnectMongo(mongoURI);
        const existingConf = await config.findOne({user_noldap:"admin"})
        if(existingConf){
            //In questo modo si crea un oggetto utilizzabile in tutto il progetto.
            fastify.decorate("CONFIGDB",existingConf._doc);
            //const f = fastify.CONFIGDB;
        }


        fastify.register(import('./app.js'), { prefix: '/api' })
        fastify.register(fastifyCors, {

            origin:"*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders:['Content-Type', 'Authorization','Content-Length', 'X-Requested-With']

        })
        fastify.listen(3001, '0.0.0.0', function (err, address){
            if (err) {
                fastify.log.error(err)
                process.exit(1)
            }
            fastify.log.info(`server listening on ${address}`);
            console.log(`server listening on ${address}`);
        })

        })
    .catch((err) => {
        //req.log.error("Avvio errore "+ err)
        console.log("Errore nell'avvio " + err);

    })





