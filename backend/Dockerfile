FROM node:22-alpine AS base
WORKDIR /app
ENV DATABASE_URL=mysql://root:admin@db:3306/callrate
COPY package*.json ./
COPY prisma ./prisma/

# Development stage
FROM base AS development
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]

# Build stage
FROM base AS builder
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Runtime stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main"]
