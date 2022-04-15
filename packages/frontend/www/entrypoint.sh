#!/bin/sh

ENV_FILE=$(find /home/node/app/packages/frontend/www/.output/ -name node-server.mjs)
TEMPLATE="$ENV_FILE.template"

if [ ! -f "$TEMPLATE" ]
then
   cp "$ENV_FILE" "$ENV_FILE.template"
fi

envsubst "$(printf '${%s} ' $(env | sed 's/=.*//'))" < "${TEMPLATE}" > "${ENV_FILE}"
[ -z "$@" ] && node /home/node/app/packages/frontend/www/.output/server/index.mjs || $@