FROM node
RUN npm install apollo-server graphql glob sqlite3 sequelize apollo-datasource
COPY code /code
WORKDIR /code
CMD node index.js
EXPOSE 80
