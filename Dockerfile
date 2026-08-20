FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg git bash

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "index.js"]
