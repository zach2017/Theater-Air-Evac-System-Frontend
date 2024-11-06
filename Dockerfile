# demo
FROM node:18 as build

LABEL maintainer="zlewis@clarityinnovates.com"
EXPOSE 3000

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./src ./src
COPY ./bin ./bin

ENTRYPOINT ["npm", "start"]
