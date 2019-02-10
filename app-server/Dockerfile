FROM node:10.11-alpine

RUN mkdir -p /app-server

WORKDIR /app-server

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001 9229

RUN apk add --no-cache curl

HEALTHCHECK --interval=1m \
            --timeout=10s \
            --retries=3 \
            CMD curl --fail --silent http://localhost:3001/api/status || exit 1

CMD ["npm","start"]
