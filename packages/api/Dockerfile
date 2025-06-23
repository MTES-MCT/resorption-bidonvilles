# ====
# Development
# ====
FROM node:20-alpine AS development

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
FROM node:20-alpine AS production

# Activer Corepack pour utiliser la bonne version de Yarn
RUN corepack enable

# Installer PM2 globalement pour la gestion des processus (en tant que root)
RUN yarn global add pm2

# Installer uniquement les dépendances nécessaires pour l'exécution (plus léger)
RUN apk add --no-cache vips

RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app/

USER node

WORKDIR /home/node/app/

# Copier tous les fichiers nécessaires pour le build
COPY --chown=node:node . .

# Installer les dépendances avec Yarn pour le build
RUN yarn install

# Build l'application
RUN yarn build

# Définir la commande de démarrage avec PM2
CMD ["pm2-runtime", "dist/server/index.js", "--name", "api"]
