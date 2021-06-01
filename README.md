Pré-requis :
- resorption-bidonvilles-deploy
- yarn 1.22

Pour que Eslint marche dans VSC, créer un fichier `/.vscode/settings.json` avec le contenu suivant :
```
{
    "eslint.workingDirectories": [
        "packages/api",
        "packages/frontend"
    ]
}
```

Installer le dépôt :
- installer les dépendances communes : `yarn install`
- installer les dépendances des packages : `yarn lerna bootstrap`