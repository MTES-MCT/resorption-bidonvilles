#!/bin/bash

function switchBranch() {
    checkout_result=$(git switch $1)
    if [[ -z $checkout_result ]]; then
        exit 1
    fi

    yarn install
}

# on récupère la liste des migrations faites actuellement
current_branch=$(git branch --show-current)
target_branch=$1
current_migrations=$(cd packages/api ; yarn sequelize db:migrate:status | ack -o '(?<=^up ).*$')

# on change de branche
switchBranch $target_branch
target_migrations=$(cd packages/api ; ls db/migrations | ack -o '^\d.+')

# si certaines migrations ne sont plus là, alors on doit revenir en arrière et les annuler
excess_migrations=$(comm -23 <(echo "$current_migrations") <(echo "$target_migrations"))

if [[ ! -z "$excess_migrations" ]]; then
    echo "Annulation de certaines migrations"

    switchBranch $current_branch
    cd packages/api

    echo "$excess_migrations" | tail -r | while read -r line; do
        echo "Annulation de la migration $line"
        yarn sequelize db:migrate:undo --name $line

        if [[ $result -ne 0 ]]; then
            cd ../..
            exit 1
        fi
    done

    cd ../..
    switchBranch $target_branch
fi
