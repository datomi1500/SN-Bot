FROM node:20-alpine

# Crear el directorio de la aplicación
WORKDIR /usr/src/app

# Instalar las dependencias de la aplicación
# Se utiliza un comodín para garantizar que se copien tanto el archivo package.json como el package-lock.json
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm ci --omit=dev

# Empaquetar el código fuente de la aplicación
COPY . .

# Exponer el puerto de comprobación de estado desde src/app.js
EXPOSE 3000

# Iniciar el bot
CMD [ "npm", "start" ]
