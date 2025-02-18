# Usar la imagen oficial de Node.js
FROM node:20-alpine

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos necesarios al contenedor
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto donde corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]

