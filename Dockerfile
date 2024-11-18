FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do código para dentro do container
COPY . .

# Adiciona o comando de build
RUN npm run build

# Define o comando padrão para iniciar a aplicação
CMD ["node", "dist/index.js"]
