FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm build
RUN npm i -g @nestjs/cli
COPY . .
EXPOSE 3000
RUN apk add --no-cache make gcc g++ python && \
  npm rebuild bcrypt --build-from-source
CMD ["npm", "run", "start"]