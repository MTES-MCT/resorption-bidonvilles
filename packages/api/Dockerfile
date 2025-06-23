# ====
# Development
# ====
FROM node:22-alpine AS development

RUN apk update && apk upgrade

RUN corepack enable

RUN apk update && apk add --no-cache build-base fftw-dev libc6-compat py3-setuptools vips vips-dev

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --silent && yarn cache clean

# ====
# Production (build)
# ====
FROM node:22-alpine AS production

RUN apk update && apk upgrade \
    && corepack enable \
    && yarn global add pm2 \
    && apk add --no-cache vips \
    && mkdir -p /home/node/app/ && chown -R node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node . .

RUN yarn install \
    && yarn build

CMD ["pm2-runtime", "dist/server/index.js", "--name", "api"]
