# Frontend d'Action Bidonvilles

## Pré-requis
- Yarn

## Développement
1. Lancer le serveur local avec hot-reload :
```
$ yarn dev
```

2. Commiter les modifications, mais ne jamais commiter les changements apportés à `dist` (voir la section "Release" plus bas)

## Release
### 1. Générer et pusher un build
Une fois tous les commits voulus mergés et pushés sur `master`, générer un nouveau build :
```
$ yarn release 0.1.2 # Remplacer 0.1.2 par le numéro de release désiré
```

Cette commande a pour effet de :
- générer un bundle minifié et production-ready via `yarn build`
- stager le dossier `dist` qui a été généré (toute autre modification est unstagée automatiquement)
- commiter le tout avec un message de commit générique
- pusher sur origin/master
- poser un tag `v0.1.2` sur le commit de release

### 2. Déclarer la release et son changelog
Depuis l'onglet "Releases" de GitHub, déclarer le changelog de cette nouvelle release

## Déploiement en production
Le bundle final étant déjà versionné, il n'y a rien de plus à faire que de `git checkout` le tag désiré :
```
$ yarn deploy v0.1.2
```

Bien entendu, il est nécessaire d'avoir un serveur HTTP configuré pour rediriger vers le dossier `/dist`, mais cela sort du cadre de ce dépôt.