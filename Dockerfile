FROM node:22-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json package-lock.json .npmrc ./
COPY plugins/source-note-brief/package*.json ./plugins/source-note-brief/

RUN npm ci --no-audit --no-fund \
  && npm ci --prefix plugins/source-note-brief --no-audit --no-fund

COPY . .

RUN npm run verify:package --prefix plugins/source-note-brief \
  && npm run install-plugins

EXPOSE 8080
CMD ["npm", "run", "serve"]
