FROM node:10.11-alpine

RUN apk add curl

RUN mkdir -p /app-server

WORKDIR /app-server

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001 9229

HEALTHCHECK --interval=1m \
            --timeout=10s \
            --retries=3 \
            CMD curl --fail --silent http://localhost:3001/api/status || exit 1

CMD ["npm","run","start:dev"]
