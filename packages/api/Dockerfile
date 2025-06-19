# ====
# Development
# ====
FROM node:18-alpine AS development

# Activer Corepack pour utiliser la bonne version de Yarn
RUN corepack enable

# Installer les dépendances système requises pour la compilation (notamment pour sharp)
RUN apk update && apk add --no-cache build-base py3-setuptools libc6-compat vips-dev fftw-dev vips

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --silent && yarn cache clean

# ====
# Production (build)
# ====
FROM node:18-alpine AS production

# Activer Corepack pour utiliser la bonne version de Yarn
RUN corepack enable

# Installer uniquement les dépendances nécessaires pour l'exécution (plus léger)
RUN apk add --no-cache vips

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY . .

RUN yarn build
ENTRYPOINT ["yarn", "serve"]
