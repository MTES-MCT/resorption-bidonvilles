# 🚀 Guide de Démarrage Rapide - Changelogs

## Créer un nouveau changelog en 3 étapes

### 1️⃣ Créer les fichiers

```bash
cd packages/api/db/seeders/scripts
node create-changelog.js 2.36.0
```

Cela crée automatiquement :
- `data/changelogs/2.36.0.json` (données)
- `000000-changelog-2.36.0.js` (seeder)

### 2️⃣ Éditer le JSON

Ouvrir `db/seeders/data/changelogs/2.36.0.json` et modifier :

```json
{
  "release": "2.36.0",
  "date": "2025-10-20T10:00:00",
  "items": [
    {
      "title": "Ma nouvelle fonctionnalité",
      "description": "<p>Description de la fonctionnalité...</p>",
      "image": "item_1.jpg"
    }
  ]
}
```

### 3️⃣ Valider et exécuter

```bash
# Valider le JSON
node scripts/validate-changelog-json.js 2.36.0

# Exécuter le seeder
cd ../..
yarn sequelize db:seed --seed 000000-changelog-2.36.0.js
```

## ✅ C'est tout !

Votre changelog est maintenant en base de données.

---

## 📋 Checklist complète

- [ ] Créer le changelog avec `create-changelog.js`
- [ ] Éditer le fichier JSON avec les bonnes données
- [ ] Ajouter les images dans `/assets/changelog/X.X.X/`
- [ ] Valider le JSON avec `validate-changelog-json.js`
- [ ] Exécuter le seeder
- [ ] Vérifier dans l'application que le changelog s'affiche

## 🆘 Besoin d'aide ?

Consultez le [README complet](./README-CHANGELOGS.md) pour plus de détails.
