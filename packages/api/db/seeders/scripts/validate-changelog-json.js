#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */

/**
 * Script pour valider un fichier JSON de changelog
 * Usage: node validate-changelog-json.js <version>
 * Exemple: node validate-changelog-json.js 2.35.0
 */

const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];

if (!version) {
    console.error('❌ Erreur : Vous devez spécifier un numéro de version');
    console.log('Usage: node validate-changelog-json.js <version>');
    console.log('Exemple: node validate-changelog-json.js 2.35.0');
    process.exit(1);
}

const jsonFileName = `${version}.json`;
const jsonPath = path.join(__dirname, '../data/changelogs', jsonFileName);

// Vérifier que le fichier existe
if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Erreur : Le fichier JSON n'existe pas : ${jsonPath}`);
    process.exit(1);
}

console.log(`🔍 Validation de ${jsonFileName}...\n`);

let changelogData;
let hasErrors = false;

// 1. Vérifier que le JSON est valide
try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    changelogData = JSON.parse(content);
    console.log('✅ JSON valide');
} catch (error) {
    console.error('❌ JSON invalide :', error.message);
    process.exit(1);
}

// 2. Vérifier la structure
const requiredFields = ['release', 'date', 'items'];
for (const field of requiredFields) {
    if (changelogData[field]) {
        console.log(`✅ Champ présent : ${field}`);
    } else {
        console.error(`❌ Champ manquant : ${field}`);
        hasErrors = true;
    }
}

// 3. Vérifier le type de items
if (Array.isArray(changelogData.items)) {
    console.log(`✅ Items est un tableau (${changelogData.items.length} éléments)`);
} else {
    console.error('❌ Le champ "items" doit être un tableau');
    hasErrors = true;
}

// 4. Vérifier la date
try {
    const date = new Date(changelogData.date);
    if (Number.isNaN(date.getTime())) {
        console.error('❌ Date invalide');
        hasErrors = true;
    } else {
        console.log(`✅ Date valide : ${date.toISOString()}`);
    }
} catch (error) {
    console.error('❌ Erreur de parsing de la date :', error.message);
    hasErrors = true;
}

// 5. Vérifier chaque item
if (Array.isArray(changelogData.items)) {
    for (const [index, item] of changelogData.items.entries()) {
        console.log(`\n📝 Item ${index + 1}:`);

        const itemRequiredFields = ['title', 'description', 'image'];
        for (const field of itemRequiredFields) {
            if (item[field]) {
                console.log(`   ✅ ${field}: ${item[field].substring(0, 50)}${item[field].length > 50 ? '...' : ''}`);
            } else {
                console.error(`   ❌ Champ manquant : ${field}`);
                hasErrors = true;
            }
        }

        // Vérifier que la description contient du HTML
        if (item.description && !item.description.includes('<')) {
            console.warn('   ⚠️  La description ne semble pas contenir de HTML');
        }
    }
}

// 6. Vérifier la cohérence de la version
if (changelogData.release !== version) {
    console.error(`\n❌ Incohérence : La version dans le JSON (${changelogData.release}) ne correspond pas au nom du fichier (${version})`);
    hasErrors = true;
}

// Résultat final
if (hasErrors) {
    console.error('❌ Validation échouée : des erreurs ont été détectées');
    process.exit(1);
} else {
    console.log('✅ Validation réussie : le fichier JSON est correct !');
    console.log('\n🚀 Vous pouvez maintenant exécuter le seeder :');
    console.log(`   yarn sequelize db:seed --seed 000000-changelog-${version}.js`);
}
