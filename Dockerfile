FROM node:lts-alpine3.20
RUN apk add chromium dumb-init
USER node
COPY --chown=node:node . /htmltopdf
WORKDIR /htmltopdf
RUN npm install
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
