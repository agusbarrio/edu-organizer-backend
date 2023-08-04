FROM node:18.17-alpine

WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

COPY ./config ./config
COPY ./constants ./constants
COPY ./controllers ./controllers
COPY ./middlewares ./middlewares
COPY ./migrations ./migrations
COPY ./models ./models
COPY ./repositories ./repositories
COPY ./routes ./routes
COPY ./services ./services
COPY ./index.js ./index.js

# Instala las dependencias
RUN npm install

# Ejecuta las migraciones de la base de datos
RUN npm run migrate

CMD ["npm", "start"]

EXPOSE 8080