<p align="center"><img src="https://resorption-bidonvilles.beta.gouv.fr/img/Marianne.d37c6b1e.svg" height="30" align="center" /> <strong>Résorption-bidonvilles</strong></p>
<h1 align="center">API de <em>Résorption-bidonvilles</em></h1>

`action-bidonvilles-api` est l'API qui alimente l'application frontend de *Résorption-bidonvilles*. Il s'agit d'une API REST construite avec Express et l'ORM Sequelize.

## 👨🏼‍🏫 Préambule
L'API de *Résorption-bidonvilles* est publiée sous la forme d'images Docker versionnées et accessibles publiquement sur Docker Hub à l'adresse suivante : [https://hub.docker.com/r/resorptionbidonvilles/api/tags](https://hub.docker.com/r/resorptionbidonvilles/api/tags).

Le présent dépôt permet de travailler sur les sources localement via un container Docker puis de builder une image finale à publier sur Docker Hub.
Si vous souhaitez déployer une instance de *Résorption-bidonvilles*, veuillez vous référer aux instructions du dépôt [resorption-bidonvilles-deploy](https://github.com/MTES-MCT/resorption-bidonvilles-deploy).

## 🛠 Pré-requis
- le dépôt [resorption-bidonvilles-deploy](https://github.com/MTES-MCT/resorption-bidonvilles-deploy), correctement installé et configuré
- nodejs
- yarn

## 🔌 Initialisation
Une fois le dépôt clôné sur votre machine :
- installez les dépendances (vous n'avez besoin que des devDependencies sur votre machine mais yarn ne permet pas de faire ce filtre) :
`yarn install`
- configurer vos hooks git via Husky avec la commande suivante :
`yarn setup`

C'est tout !

## 🙇🏼 Contributeur(ices)

| <img src="https://avatars3.githubusercontent.com/u/1801091?v=3" width="120px;"/><br /><sub><b>Anis Safine Laget</b></sub> | <img src="https://avatars3.githubusercontent.com/u/50863659?v=3" width="120px;"/><br /><sub><b>Christophe Benard</b></sub> | <img src="https://avatars3.githubusercontent.com/u/5053593?v=3" width="120px;"/><br /><sub><b>⠀⠀Gaël Destrem</b></sub> |
| --- | --- | --- |

## 📝 Licence
Ce projet est distribué sous license [AGPL-3.0](LICENSE).