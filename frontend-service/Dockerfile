FROM node:20

WORKDIR /frontend-service

COPY ./package.json /frontend-service/package.json

COPY ./package-lock.json /frontend-service/package-lock.json

RUN npm install

COPY . /frontend-service
