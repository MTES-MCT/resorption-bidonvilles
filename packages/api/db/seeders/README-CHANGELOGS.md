# Système de Changelogs Modulaire

Ce système permet de gérer les changelogs de manière modulaire en séparant les données (JSON) de la logique (seeders).

## 🎯 Avantages de cette approche

✅ **Séparation des données et de la logique** : Les données sont dans des fichiers JSON faciles à éditer  
✅ **Réutilisabilité** : Un seul helper pour tous les changelogs  
✅ **Validation** : Le helper valide automatiquement la structure des données  
✅ **Maintenance** : Plus facile de modifier les données sans toucher au code  
✅ **Versioning** : Les fichiers JSON peuvent être versionnés indépendamment

## 📁 Structure

```
db/seeders/
├── data/
│   └── changelogs/
│       └── 2.36.0/        # Répertoire contenant les images illustrant le changelog
│           ├── item_1.jpg # Image de l'item 1
│           └── ...        # Autres images
├── data/
│   └── changelogs/
│       ├── README.md           # Documentation des fichiers JSON
│       ├── template.json       # Template pour nouveaux changelogs
│       └── 2.36.0.json        # Données du changelog 2.36.0
├── helpers/
│   ├── createChangelogSeederFromJson.js  # Helper principal
│   └── seederTransaction.js              # Helper transactionnel
├── scripts/
│   ├── create-changelog.js              # Créer un nouveau changelog
│   └── generate-changelog-seeder.js     # Générer un seeder depuis JSON
└── 000000-changelog-2.36.0.js          # Seeder pour 2.36.0
```

## 🚀 Utilisation

### Méthode 1 : Script automatique (recommandé)

Créer un nouveau changelog complet (JSON + seeder) :

```bash
cd db/seeders/scripts
node create-changelog.js 2.36.0
```

Cela va :
1. Créer `packages/api/db/seeders/data/changelogs/2.36.0.json` à partir du template
2. Créer `packages/api/assets/changelogs/2.36.0` pour les illustrations graphiques
2. Créer `000000-changelog-2.36.0.js`
3. Afficher les prochaines étapes

### Méthode 2 : Manuelle

#### Étape 1 : Créer le fichier JSON

Copier le template et modifiez-le :

```bash
cp db/seeders/data/changelogs/template.json db/seeders/data/changelogs/2.36.0.json
```

Éditer `2.36.0.json` :

```json
{
  "release": "2.36.0",
  "date": "2025-10-13T10:00:00",
  "items": [
    {
      "title": "Nouvelle fonctionnalité",
      "description": "<p>Description de la fonctionnalité...</p>",
      "image": "item_1.jpg"
    }
  ]
}
```

#### Étape 2 : Créer le seeder

Créer `db/seeders/000000-changelog-2.36.0.js` :

```javascript
const createChangelogSeederFromJson = require('./helpers/createChangelogSeederFromJson');

module.exports = createChangelogSeederFromJson('2.36.0.json');
```

#### Étape 3 : Ajouter les images

Créer le répertoire `packages/api/assets/changelogs/2.36.0`
Placer les images nommées `item_1.jpg`, `item_2.jpg`, etc. dans `packages/api/assets/changelogs/2.36.0`

#### Étape 4 : Exécuter le seeder

Se placer dans le répertoire `packages/api/` et exécuter :

```bash
yarn sequelize db:seed -- --seed 000000-changelog-2.36.0.js
```

## 📝 Format du fichier JSON

```json
{
  "release": "X.X.X",           // Version (requis)
  "date": "YYYY-MM-DDTHH:mm:ss", // Date ISO 8601 (requis)
  "items": [                     // Liste des éléments (requis)
    {
      "title": "Titre",          // Titre (requis)
      "description": "<p>...</p>", // HTML (requis)
      "image": "item_1.jpg"      // Nom ou URL (requis)
    }
  ]
}
```

### Images

- **Chemin relatif** : `"item_1.jpg"` → `/assets/changelog/{version}/item_1.jpg`

## 🔧 Scripts disponibles

### create-changelog.js

Crée un nouveau changelog complet (JSON + seeder).

```bash
node scripts/create-changelog.js <version>
```

### generate-changelog-seeder.js

Génère uniquement le seeder à partir d'un JSON existant.

```bash
node scripts/generate-changelog-seeder.js <version>
```

## 🔄 Migration depuis l'ancien système

L'ancien système (données inline dans le seeder) est toujours supporté mais déprécié.

Pour migrer un ancien changelog :

1. Extraire les données dans un fichier JSON
2. Créer un nouveau seeder utilisant `createChangelogSeederFromJson`
3. Supprimer l'ancien seeder

Exemple de migration :

**Avant** (`000000-changelog-2.34.4.js`) :
```javascript
const changelog = {
    app_version: '2.34.4',
    date: new Date('2025-07-15T02:24:00'),
    items: [...]
};

module.exports = {
    up: queryInterface => ...,
    down: queryInterface => ...
};
```

**Après** :

1. Créer `data/changelogs/2.34.4.json` avec les données
2. Remplacer le seeder par :
```javascript
const createChangelogSeederFromJson = require('./helpers/createChangelogSeederFromJson');
module.exports = createChangelogSeederFromJson('2.34.4.json');
```

## ⚠️ Notes importantes

- Les fichiers JSON doivent être valides (utilisez un validateur JSON)
- Les images doivent exister avant d'exécuter le seeder
- La version doit être unique (pas de doublons)
- Le format de date doit être ISO 8601

## 🐛 Dépannage

### Erreur : "Fichier JSON introuvable"

Vérifier que le fichier existe dans `db/seeders/data/changelogs/`

### Erreur : "Format JSON invalide"

Vérifier que votre JSON contient bien `release`, `date` et `items`

### Images non affichées

Vérifier que les images sont dans `/assets/changelog/{version}/`
