FROM node:latest as builder
USER root
RUN npm cache clean --force
WORKDIR /workspace
RUN npm i -g @nestjs/cli
COPY package.json yarn.lock /workspace/
COPY . .
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python
RUN npm build
EXPOSE 3000
CMD ["npm", "run", "start"]