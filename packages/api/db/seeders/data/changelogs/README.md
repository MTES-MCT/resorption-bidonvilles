# Changelogs - Données JSON

Ce dossier contient les fichiers JSON de données pour les changelogs de l'application.
Ces changelogs sont utilisés pour l'affichage des popups "nouveautés" côté frontend.

## Structure d'un fichier JSON

```json
{
  "release": "X.X.X",
  "date": "YYYY-MM-DDTHH:mm:ss",
  "items": [
    {
      "title": "Titre de la fonctionnalité",
      "description": "<p>Description HTML de la fonctionnalité...</p>",
      "image": "item_1.jpg"
    }
  ]
}
```

### Propriétés

- **release** (string, requis) : Numéro de version (ex: "2.36.0")
- **date** (string, requis) : Date de sortie au format ISO 8601
- **items** (array, requis) : Liste des éléments du changelog
  - **title** (string, requis) : Titre de l'élément
  - **description** (string, requis) : Description HTML de l'élément
  - **image** (string, requis) : Nom du fichier image (ex: "item_1.jpg")

### Images

Les images doivent être placées dans : `/assets/changelog/{version}/`

Par exemple, pour la version `2.36.0`, les images seront dans :
`/assets/changelog/2.36.0/item_1.jpg`

## Exécuter le seeder

```bash
yarn sequelize db:seed --seed 000000-changelog-X.X.X.js
```

1. Crée le fichier `X.X.X.json` dans `data/changelogs/` avec les données du changelog.
2. Crée le fichier seeder dans `/db/seeders/`.

### Lancer la commande:

```javascript
const createChangelogSeederFromJson = require('./helpers/createChangelogSeederFromJson');

module.exports = createChangelogSeederFromJson('X.X.X.json');
```