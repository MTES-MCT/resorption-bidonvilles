# ====
# Development
# ====
FROM node:16.3-slim AS development

RUN apt-get update || : && apt-get install -y \
    python \
    build-essential

RUN mkdir -p /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --silent && yarn cache clean

# ====
# Production (build)
# ====
FROM node:16.3-slim AS build

RUN apt-get update || : && apt-get install -y \
    python \
    build-essential

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --from=development --chown=root:root /home/node/app/node_modules ./node_modules
COPY . .

RUN yarn build

# ====
# Production (served)
# ====
FROM nginx:1.19-alpine AS production

COPY ./docker/nginx-entrypoint.sh /

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /home/node/app/dist /usr/share/nginx/html

ENTRYPOINT [ "sh", "/nginx-entrypoint.sh" ]