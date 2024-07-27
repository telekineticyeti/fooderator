FROM node:carbon
MAINTAINER paul.castle@gmail.com

RUN npm install -g nodemon

WORKDIR /usr/app
ADD . /usr/app

