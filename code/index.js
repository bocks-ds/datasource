const { ApolloServer } = require('apollo-server');

const databaseInstance = require('database/builder')
const DefinitionsBuilder = require('definitions/builder')
const ResolversBuilder = require('resolvers/builder')
const env = require('env_vars')

if (env.deployment == 'prod' && env.sentryDsn) {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: env.sentryDsn });
}


databaseInstance.initialize().then(_ => {
    const typeDefs = new DefinitionsBuilder().get_type_defs() // must run prior to ResolversBuilder
    const resolvers = new ResolversBuilder()

    env.logger.info("Preparing Apollo Server...")

    const server = new ApolloServer({typeDefs, resolvers})

    env.logger.info("Apollo Server ready to launch.")
    env.logger.info("Launching GraphQL via Apollo Server...")

    server.listen({ port: env.port }).then(({ url }) => {
        env.logger.info(`🚀  Apollo Server ready at ${url}.`);
    }).catch(error => {
        env.logger.error(error.message)
    })
}).catch(error => {
    env.logger.error(error.message.split('\n\n').join(' | '))
    throw error
})
