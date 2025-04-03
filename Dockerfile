FROM node:22-alpine

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Pupetteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \    
    PUPPETEER_DISABLE_DEV_SHM_USAGE=true

# App
WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"]