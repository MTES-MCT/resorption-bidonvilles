#!/bin/sh

find /usr/share/nginx/html/assets/ -iname 'index*.js' -print0 | while read -d $'\0' file
do
    TEMPLATE="$file.template"
    if [ ! -f "$TEMPLATE" ]
    then
        cp "$file" "$file.template"
    fi

    envsubst "$(printf '${%s} ' $(env | sed 's/=.*//'))" < "${TEMPLATE}" > "${file}"
done

[ -z "$@" ] && nginx-debug -g 'daemon off;' || $@
