# Usa una imagen base ligera de Node
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto 3000 (el puerto por defecto de react-scripts)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]

