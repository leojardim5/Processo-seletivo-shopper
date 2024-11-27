# Use uma imagem base para Node.js
FROM node:20

# Configuração do diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos do backend
COPY package*.json ./

# Instalar dependências do backend
RUN npm install

# Copiar o restante dos arquivos do backend
COPY . .

# Compilar o TypeScript (se necessário)
RUN npm run build

# Expor a porta 8080
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "start"]
