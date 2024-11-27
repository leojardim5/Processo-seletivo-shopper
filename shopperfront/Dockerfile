# Use uma imagem base para Node.js
FROM node:20

# Configuração do diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Executar o build do Next.js
RUN npm run build

# Expor a porta 80
EXPOSE 80

# Iniciar o servidor de produção
CMD ["npm", "start"]
