module.exports = {
    sentryDsn: undefined,
    deployment: 'dev', // Change this to prod when building image! (This process is due for improvements)
    debugLevel: 0,
    subDebugLevels: {
        definitions: 0,
        database: 0,
        resolvers: 0,
    }
}