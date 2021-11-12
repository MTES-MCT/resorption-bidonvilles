# ====
# Development
# ====
FROM node:16.3-slim AS development

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --silent && yarn cache clean

# ====
# Production (build)
# ====
FROM node:16.3-slim AS production

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --from=development --chown=root:root /home/node/app/node_modules ./node_modules
COPY . .

RUN yarn build
ENTRYPOINT ["yarn", "start"]
