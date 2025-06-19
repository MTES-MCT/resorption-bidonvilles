#!/bin/sh

# Cherche de manière robuste le fichier de configuration Nuxt contenant les placeholders.
# On cible n'importe quel fichier .mjs dans le répertoire serveur.
# Le motif de grep recherche une chaîne comme "${UNE_VARIABLE_QUELCONQUE}" ce qui est
# caractéristique des placeholders d'environnement laissés par Nuxt.
ENV_FILE=$(find /home/node/app/.output/server -type f -name "*.mjs" -exec grep -lE '"\$\{[A-Z0-9_]+\}"' {} + | head -n 1)

# Si un fichier de configuration a été trouvé, on procède à la substitution.
if [ -n "$ENV_FILE" ]; then
    echo "Substitution des variables d'environnement dans $ENV_FILE"
    TEMPLATE="$ENV_FILE.template"

    # Crée le fichier template s'il n'existe pas
    if [ ! -f "$TEMPLATE" ]; then
        cp "$ENV_FILE" "$TEMPLATE"
    fi

    # Substitue toutes les variables d'environnement (comportement par défaut de envsubst)
    # La liste des variables à substituer est générée à partir de l'environnement actuel.
    envsubst "$(printf '${%s} ' $(env | sed 's/=.*//' | grep -E '^[A-Z0-9_]+$'))" < "${TEMPLATE}" > "${ENV_FILE}"
fi

# Utilise exec pour que Node.js devienne le processus principal (PID 1)
# Cela permet de recevoir correctement les signaux du système (ex: SIGTERM pour un arrêt propre)
[ -z "$@" ] && exec node /home/node/app/.output/server/index.mjs || exec "$@"