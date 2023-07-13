FROM node:18-alpine

WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.lock ./package-lock.lock

RUN npm install
COPY ./config ./config
COPY ./constants ./constants
COPY ./controllers ./controllrs
COPY ./middlewares ./middlewares
COPY ./migrations ./migrations
COPY ./models ./models
COPY ./repositories ./repositories
COPY ./routes ./routes
COPY ./services ./services
COPY ./index.js ./index.js
COPY ./Dockerfile ./Dockerfile
COPY ./docker-compose.yml ./docker-compose.yml

RUN npm run migrate

CMD ["npm", "start"]