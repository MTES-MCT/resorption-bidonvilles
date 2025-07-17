# Doc d’intégration d’icônes

## Documentation pour intégrer les icônes officielles du DSFR

👉 https://docs.vue-ds.fr/guide/icones-officielles

## Documentation pour intégrer les icônes de la librairie Iconify

La première étape consiste à ajouter l’icône de votre choix dans le fichier de configuration : `webapp/scripts/icons.js`.

Dans l’exemple ci-dessous, vous pouvez voir que trois librairies sont actuellement utilisées : `ri`, `mdi` et `uil`.

### ➕ Ajouter une nouvelle librairie

Pour ajouter une nouvelle librairie, il faut également l’ajouter dans le fichier `webapp/package.json`.

### ➕ Ajouter une icône à une librairie déjà présente

Si la librairie est déjà installée, il suffit d’ajouter le nom de l’icône à la liste correspondante, comme dans l’exemple ci-dessous :

```js
// @ts-check
const { icons: mdiCollection } = require('@iconify-json/mdi');
const { icons: riCollection } = require('@iconify-json/ri');
const { icons: uilCollection } = require('@iconify-json/uil');

const riIconNames = [
  'file-excel-fill',
];

const mdiIconNames = [
  'account-heart',
  'account-key',
];

const uilIconNames = [
  'temperature-plus',
];

module.exports.collectionsToFilter = [
  [riCollection, riIconNames],
  [mdiCollection, mdiIconNames],
  [uilCollection, uilIconNames],
];
```

## Génération des icônes

Dans le fichier `webapp/package.json`, la commande `icons` permet de générer le fichier `icon-collections.js`, qui contiendra les icônes utilisables dans l'application.

Une fois généré, ce fichier sera en TypeScript. Il faudra donc le modifier pour qu’il soit en JavaScript, comme dans l’exemple suivant :

```js
const collections = [{"prefix":"ri", ...}]
export const ri = { "fileExcelFill": "ri:file-excel-fill" };
export const mdi = { "accountHeart": "mdi:account-heart", "accountKey": "mdi:account-key" };
export const uil = { "temperaturePlus": "uil:temperature-plus" };
export default collections;
```

## Utilisation

Après avoir généré et formaté votre fichier, vous pouvez utiliser vos icônes librement dans n’importe quel fichier de votre projet 🎉