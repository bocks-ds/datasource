FROM node
RUN npm install apollo-server graphql glob sqlite3 sequelize apollo-datasource @sentry/node@5.15.4
COPY code /code
WORKDIR /code
CMD node index.js
EXPOSE 80
