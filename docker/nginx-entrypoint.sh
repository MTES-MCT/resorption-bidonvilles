#!/bin/sh

ENV_FILE=$(find /usr/share/nginx/html/js/index.*.js)
TEMPLATE="$ENV_FILE.template"

if [ ! -f "$TEMPLATE" ]
then
    cp "$ENV_FILE" "$ENV_FILE.template"
fi

envsubst "$(printf '${%s} ' $(env | sed 's/=.*//'))" < "${TEMPLATE}" > "${ENV_FILE}"

[ -z "$@" ] && nginx-debug -g 'daemon off;' || $@