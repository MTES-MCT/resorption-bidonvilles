#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Script pour créer un nouveau changelog (JSON + seeder)
 * Usage: node create-changelog.js <version>
 * Exemple: node create-changelog.js 2.35.0
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
    console.error('❌ Erreur : Vous devez spécifier un numéro de version');
    console.log('Usage: node create-changelog.js <version>');
    console.log('Exemple: node create-changelog.js 2.35.0');
    process.exit(1);
}

const jsonFileName = `${version}.json`;
const jsonPath = path.join(__dirname, '../data/changelogs', jsonFileName);
const seederFileName = `000000-changelog-${version}.js`;
const seederPath = path.join(__dirname, '..', seederFileName);

// Vérifier si les fichiers existent déjà
if (fs.existsSync(jsonPath)) {
    // eslint-disable-next-line no-console
    console.error(`❌ Erreur : Le fichier JSON existe déjà : ${jsonFileName}`);
    process.exit(1);
}

if (fs.existsSync(seederPath)) {
    // eslint-disable-next-line no-console
    console.error(`❌ Erreur : Le seeder existe déjà : ${seederFileName}`);
    process.exit(1);
}

// Créer le fichier JSON à partir du template
const templatePath = path.join(__dirname, '../data/changelogs/template.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

// Mettre à jour avec la version et la date actuelle
template.release = version;
template.date = new Date().toISOString();

fs.writeFileSync(jsonPath, JSON.stringify(template, null, 2), 'utf8');

// Créer le répertoire pour les illustrations graphiques
const assetsDir = path.join(__dirname, '../../../assets/changelog', version);
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Créer le fichier seeder
const seederContent = `const createChangelogSeederFromJson = require('./helpers/createChangelogSeederFromJson');

module.exports = createChangelogSeederFromJson('${jsonFileName}');
`;

fs.writeFileSync(seederPath, seederContent, 'utf8');

console.log('✅ Changelog créé avec succès !');
console.log('\n📄 Fichiers créés :');
console.log(`   - ${jsonFileName}`);
console.log(`   - ${seederFileName}`);
console.log('\n📁 Répertoire créé :');
console.log(`   - /assets/changelog/${version}/`);
console.log('\n📝 Prochaines étapes :');
console.log(`   1. Éditez le fichier JSON : db/seeders/data/changelogs/${jsonFileName}`);
console.log(`   2. Ajoutez les images dans : /assets/changelog/${version}/`);
console.log(`   3. Exécutez le seeder : yarn sequelize db:seed --seed ${seederFileName}`);
