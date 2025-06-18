# ====
# Development
# ====
FROM node:22-alpine AS development

# Activer Corepack pour utiliser la bonne version de Yarn
RUN corepack enable

# Installer les dépendances système nécessaires pour la compilation des modules natifs
RUN apk add --no-cache build-base python3 make g++ vips-dev fftw-dev

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./.yarn/releases/ ./.yarn/plugins/ ./

RUN echo "DEBUG: Contenu de .yarn/releases/ AVANT yarn install:" && ls -la .yarn/releases/ && echo "DEBUG: Contenu de .yarn/ AVANT yarn install:" && ls -la .yarn/

RUN node .yarn/releases/yarn-3.2.0.cjs install --immutable && node .yarn/releases/yarn-3.2.0.cjs cache clean
# ====
# Production (build)
# ====
FROM node:22-alpine AS production

# Activer Corepack pour utiliser la bonne version de Yarn
RUN corepack enable

# Installer les dépendances système nécessaires pour la compilation des modules natifs
# et les dépendances d'exécution pour sharp (vips)
RUN apk add --no-cache build-base python3 make g++ vips-dev fftw-dev vips

RUN mkdir /home/node/app/ && chown node:node /home/node/app/

USER node

WORKDIR /home/node/app/

COPY . .

RUN yarn build
ENTRYPOINT ["yarn", "serve"]
