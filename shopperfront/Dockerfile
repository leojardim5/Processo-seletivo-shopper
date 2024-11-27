# Use uma imagem base para Node.js
FROM node:20

# Configuração do diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos do frontend
COPY package*.json ./

# Instalar dependências do frontend
RUN npm install

# Copiar o restante dos arquivos do frontend
COPY . .

# Compilar o projeto Next.js
RUN npm run build

# Expor a porta 80
EXPOSE 80

# Comando de inicialização
CMD ["npm", "start"]
