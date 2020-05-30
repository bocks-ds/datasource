FROM node
RUN npm install apollo-datasource \
    apollo-server \
    graphql \
    glob \
    papaparse \
    sqlite3 \
    sequelize \
    @sentry/node@5.15.4 \
    uuid \
    winston
COPY code /code
WORKDIR /code
EXPOSE 80
ENTRYPOINT [ "node", "index.js" ]
