const { ApolloServer } = require('apollo-server');

const databaseInstance = require('database/builder')
const DefinitionsBuilder = require('definitions/builder')
const ResolversBuilder = require('resolvers/builder')
const env = require('env_vars')
const LoggerInstance = require('winston_logger')


LOGGER = new LoggerInstance('core')

if (env.isProduction && env.sentryDsn) {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: env.sentryDsn });
}


databaseInstance.initialize().then(_ => {
    // Try to put these together into a single import: {typeDefs, resolvers}
    const typeDefs = new DefinitionsBuilder().get_type_defs() // must run prior to ResolversBuilder
    const resolvers = new ResolversBuilder()

    LOGGER.info("Preparing Apollo Server...")

    const server = new ApolloServer({typeDefs, resolvers})

    LOGGER.info("Apollo Server ready to launch.")
    LOGGER.info("Launching GraphQL via Apollo Server...")

    server.listen({ port: env.port }).then(({ url }) => {
        LOGGER.info(`🚀  Apollo Server ready at ${url}.`);
    }).catch(error => {
        LOGGER.error(error.message)
    })
}).catch(error => {
    LOGGER.error(error.message.split('\n\n').join(' | '))
    throw error
})
