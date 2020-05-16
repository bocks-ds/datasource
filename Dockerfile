FROM node
RUN npm install apollo-datasource \
    apollo-server \
    graphql \
    glob \
    papaparse \
    sqlite3 \
    sequelize \
    @sentry/node@5.15.4
COPY code /code
WORKDIR /code
ENTRYPOINT [ "node", "index.js" ]
EXPOSE 80
