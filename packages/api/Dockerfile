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

# Copier les fichiers sans spécifier le propriétaire
COPY package.json yarn.lock ./
# Changer le propriétaire explicitement
RUN chown node:node package.json yarn.lock && \
    yarn install --silent && yarn cache clean

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

# Copier d'abord les fichiers de configuration sans spécifier le propriétaire
COPY package.json yarn.lock .sequelizerc ./
RUN chown node:node package.json yarn.lock .sequelizerc

# S'assurer que les répertoires nécessaires existent
RUN mkdir -p /home/node/app/packages/frontend \
    && mkdir -p /home/node/app/server \
    && mkdir -p /home/node/app/db \
    && mkdir -p /home/node/app/assets

# Copier les fichiers de code source nécessaires sans spécifier le propriétaire
COPY tsconfig*.json ./
COPY server/ ./server/
COPY db/ ./db/
COPY assets/ ./assets/

# Copier les fichiers frontend/common depuis le répertoire parent
COPY ../frontend/common ./packages/frontend/common/

# Changer le propriétaire de tous les fichiers copiés
RUN chown -R node:node /home/node/app/

RUN yarn install --ignore-scripts \
    && yarn build

CMD ["pm2-runtime", "dist/server/index.js", "--name", "api"]
