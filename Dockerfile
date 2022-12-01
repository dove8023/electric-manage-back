FROM node:19.0.1-alpine
WORKDIR /opt/app
COPY ./ /opt/app
RUN yarn
RUN yarn build
RUN rm -rf src
CMD node ./dist/serve.js
