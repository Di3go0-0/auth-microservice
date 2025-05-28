
# Etapa 1: construcción
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Instala dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto y compila
COPY . .
RUN npm run build

# Etapa 2: imagen final ligera
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Solo instala producción
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia build desde builder
COPY --from=builder /usr/src/app/dist ./dist

# Variables de entorno por defecto (puedes sobrescribirlas en docker-compose)
ENV NODE_ENV=production 
ENV PORT=3000

EXPOSE 3000

# Arranca el servidor
CMD ["node", "dist/main.js"]
