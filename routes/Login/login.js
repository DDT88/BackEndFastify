import fastify from "fastify";
import S from "fluent-json-schema";
import LdapAuth from  'ldapauth-fork';




export default async function login(fastify,option){


    fastify.addHook('onRequest', fastify.authenticate)
    fastify.addHook('preHandler',fastify.logging)


    fastify.route({
        method: 'POST',
        path: '/login',
        schema: {
            body: S.object()
                .prop('username', S.string().required())
                .prop('password', S.string().required())
                .additionalProperties(false),
            response:{
               200 :
                   S.object()
                       .prop("user", S.object()
                           .prop("sn",S.string())
                           .prop("cn",S.string())
                           .prop("sAMAccountName",S.string())
                           .prop("displayName",S.string())
                       )
                   ,


        //.prop("ruoli",S.array().items(S.object().prop("user",S.object().prop("uid",S.string()))))

                401: S.object().ref('errorCustom#')
            }

        },
        handler: onLogin
    })

     function onLogin(req,reply){


        //BindDN DN manager e password
        var ldap = new LdapAuth({
            url: fastify.CONFIGDB.url_ldap,//'ldap://directory.services.external.local:389',
            bindDN: fastify.CONFIGDB.bindDN,//'uid=X0231823,OU=Personale Esterno,O=Telecom Italia Group',
            bindCredentials: fastify.CONFIGDB.bindCredentials,//'Deltoso26!,',
            searchBase: fastify.CONFIGDB.searchBase,//o=Telecom Italia Group', //root DN: dc=lan, dc=athonet, dc=com
            searchFilter:  fastify.CONFIGDB.searchFilter,//'(uid={{username}})',
            reconnect: true
        });

        //per saltare ldap
        if(fastify.CONFIGDB.user_noldap == req.body.username){
            if(fastify.CONFIGDB.pass_noldap == req.body.password){
                reply.code(200)
                let user = {cn:"admin",sn:"admin",sAMAccountName:"admin",displayName:"admin"}
                reply.send({user:user})
            }else{
                const notFoundErr = fastify.httpErrors.unauthorized("Credenziali errate")
                reply.send(notFoundErr)
            }

        }else{
            ldap.authenticate(req.body.username,req.body.password, function(err, user) {
                if (err) {
                    const notFoundErr = fastify.httpErrors.unauthorized(err)
                    reply.send(notFoundErr)
                }else{

                    reply.code(200)

                    console.log(user);
                    reply.send({user:user} )
                }
            });
        }

    }



}