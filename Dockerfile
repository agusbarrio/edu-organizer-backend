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

CMD ["npm", "run", "start:migrate"]

EXPOSE 8080