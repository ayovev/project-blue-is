# ============= BUILD CLIENT =============
FROM node:10.11-alpine AS client-build

ENV NODE_ENV development

RUN mkdir -p /app-client

WORKDIR /app-client

COPY app-client/package.json app-client/package-lock.json ./

RUN npm install

COPY app-client/ ./

ENV NODE_ENV production

RUN npm run build && npm prune --production

# ============= CONFIGURE SERVER =============
FROM node:10.11-alpine

RUN apk add curl

ENV NODE_ENV production

RUN mkdir -p /app-server

WORKDIR /app-server

COPY app-server/package.json app-server/package-lock.json ./

RUN npm install

COPY --from=client-build /app-client/build ./build

COPY app-server ./

HEALTHCHECK --interval=1m \
            --timeout=10s \
            --retries=3 \
            CMD curl --fail --silent http://localhost:8080/api/status || exit 1

ENTRYPOINT ["node","bin/www"]
