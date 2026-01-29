FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG API_PROXY_TARGET
ARG DOCKER
ENV API_PROXY_TARGET=$API_PROXY_TARGET
ENV DOCKER=$DOCKER

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
# Nếu project có public/ (thường có) thì giữ dòng này
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
