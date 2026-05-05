FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
USER node
COPY --from=builder --chown=node:node /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
