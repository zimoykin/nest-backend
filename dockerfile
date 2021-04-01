FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm build
RUN npm i -g @nestjs/cli
COPY . .
COPY .env.development .env
#EXPOSE 3000
RUN apk add --no-cache make gcc g++ python && \
  npm rebuild bcrypt --build-from-source && \
  npm rebuild child_process --build-from-source

CMD ["npm", "run", "start", "--", "--m"]