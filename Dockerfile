FROM node:16-alpine

# Labels
LABEL vendor="Onify"
LABEL code="nodejs"

# Create app directory
RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY ./functions ./functions
COPY ./plugins ./plugins
COPY ./data ./data
COPY ./lib ./lib
COPY ./package-lock.json ./
COPY ./package.json ./
COPY ./app.js ./

RUN npm ci
RUN npm prune --production

ENV NODE_ENV=production

ENTRYPOINT [ "npm", "start", "--silent" ]
