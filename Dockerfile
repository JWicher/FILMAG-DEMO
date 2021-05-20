FROM node:14.16-alpine

RUN mkdir -p /code
COPY ./ ./code