FROM node:18-alpine

WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install
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

CMD ["npm", "run", "migrate"]
CMD ["npm", "start"]

EXPOSE 8080