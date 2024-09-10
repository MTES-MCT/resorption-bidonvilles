#!/bin/sh

ENV_FILE=$(find /home/node/app/.output/ -name runtime.mjs -exec grep -l 'NUXT_' {} +)
TEMPLATE="$ENV_FILE.template"

if [ ! -f "$TEMPLATE" ]
then
   cp "$ENV_FILE" "$ENV_FILE.template"
fi

envsubst "$(printf '${%s} ' $(env | sed 's/=.*//'))" < "${TEMPLATE}" > "${ENV_FILE}"
[ -z "$@" ] && node /home/node/app/.output/server/index.mjs || $@