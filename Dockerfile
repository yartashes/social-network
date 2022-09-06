FROM node:16 as backBuild

ADD . /app

WORKDIR /app

RUN npm i

RUN npm run build

RUN npm prune --production

RUN chown -R root:root /app
