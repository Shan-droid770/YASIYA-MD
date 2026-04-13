FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg git bash libc6-compat

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm install -g pm2

ENV NODE_ENV=production

# Expose port for health checks (optional)
EXPOSE 3000

# Use PM2 runtime with watch
CMD ["pm2", "start", "yasiya-md.js", "--deep-monitoring", "--attach", "--name", "yasiya-md"]