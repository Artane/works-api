FROM node:8.1.2-alpine

WORKDIR /app
ADD . /app

RUN npm install

CMD npm run mini-start
