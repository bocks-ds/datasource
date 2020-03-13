const { ApolloServer, gql } = require('apollo-server');

const databaseInstance = require('database/builder')
const typeDefs = require('definitions/builder')
const ResolversBuilder = require('resolvers/builder')
const env = require('env_vars')

databaseInstance.initialize().then(response => {
    const resolvers = new ResolversBuilder()

    env.logger.info("Preparing Apollo Server...")
    const server = new ApolloServer({typeDefs, resolvers})
    env.logger.info("Apollo Server ready to launch.")
    env.logger.info("Launching GraphQL via Apollo Server...")
    server.listen({ port: env.port }).then(({ url }) => {
        env.logger.info(`🚀  Apollo Server ready at ${url}.`);
    });
}).catch(error =>{env.logger.info(error)})
