# ====
# Development
# ====
FROM node:15.11-slim AS development

RUN mkdir -p /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --silent && yarn cache clean

# ====
# Production (build)
# ====
FROM node:15.11-slim AS build

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