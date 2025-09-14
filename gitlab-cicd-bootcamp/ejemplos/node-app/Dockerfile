# Dockerfile para aplicación Node.js de ejemplo
FROM node:16-alpine

# Información del mantenedor
LABEL maintainer="GitLab CI/CD Bootcamp"
LABEL description="Aplicación Node.js de ejemplo para demostrar CI/CD"

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar código de la aplicación
COPY src/ ./src/

# Cambiar propietario de archivos
RUN chown -R nextjs:nodejs /usr/src/app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando por defecto
CMD ["node", "src/index.js"]