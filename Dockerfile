# Stage 1: build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: production
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
COPY doc ./doc

RUN npm i --omit=dev && npm cache clean --force && \
    rm -rf node_modules/prisma \
           node_modules/typescript \
           node_modules/effect \
           node_modules/@nestjs/cli \
           node_modules/ts-node \
           node_modules/ts-loader \
           node_modules/jest

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

USER node
EXPOSE 4000
CMD ["node", "dist/src/main"]