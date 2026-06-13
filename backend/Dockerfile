FROM node:22-alpine AS build

WORKDIR /app

# Copia apenas os arquivos de manifesto primeiro (cache de layers)
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Gera o Prisma Client e compila o TypeScript
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json

RUN npx prisma generate && cp -r src/generated dist/generated

EXPOSE 3000
CMD ["node", "dist/main/server.js"]