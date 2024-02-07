# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app/doco

# Copia los archivos necesarios para instalar las dependencias
COPY ./doco/package.json ./

# Instala las dependencias del proyecto
RUN npm install

COPY  ./doco/next.config.js ./next.config.js
COPY ./doco/next-i18next.config.js ./next-i18next.config.js
COPY ./doco/public ./public
COPY ./doco/src ./src


#COPY ./doco/ ./
# Comando para iniciar la aplicación en modo de desarrollo
CMD ["npm", "run", "dev"]
