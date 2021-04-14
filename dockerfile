FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i -g @nestjs/cli
COPY . .
COPY .env.development .env
RUN mkdir -p ~/uploads
COPY /uploads/index.html /uploads/index.html
RUN mkdir -p ~/uploads/files
RUN mkdir -p ~/uploads/deleted
RUN mkdir -p ~/uploads/photos

#EXPOSE 3000
RUN apk add --no-cache make gcc g++ python && \
  npm rebuild bcrypt --build-from-source && \
  npm rebuild child_process --build-from-source

CMD ["npm", "run", "start"]