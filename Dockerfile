FROM node:16-alpine

# Labels
LABEL vendor="Onify"
LABEL code="nodejs"

# Create app directory
RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY ./functions ./functions
COPY ./server.js ./
COPY ./package-lock.json ./
COPY ./package.json ./

# Install
RUN npm ci

RUN npm prune --production

ENV NODE_ENV=production

ENTRYPOINT [ "npm", "start" ]
