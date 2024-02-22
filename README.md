<p align="center">
  <span href="https://resorption-bidonvilles.beta.gouv.fr">
    <img src="https://resorption-bidonvilles.beta.gouv.fr/img/Marianne.d37c6b1e.svg" alt="Résorption-bidonvilles" align="down" height="30">
    <strong><font size="6">Résorption-bidonvilles</font></strong><br/>
    Agir pour résorber les bidonvilles
  </span>

  <h3 align="center"></h3>

  <p align="center">
    [Sources de la plateforme]
    <br />
    <a href="https://github.com/MTES-MCT/action-bidonvilles/wiki"><strong>Consulter le wiki »</strong></a>
    <br />
    <br />
    <a href="https://resorption-bidonvilles.beta.gouv.fr">Voir la plateforme</a>
    ·
    <a href="#developper">Contribuer au développement</a>
    ·
    <a href="https://github.com/MTES-MCT/resorption-bidonvilles-deploy">Déployer une instance</a>
  </p>
</p>

<h2 id="developper">🤓 Préambule</h2>

Ce dépôt est un monorepo, c'est à dire qu'il contient les sources de plusieurs applicatifs distincts et séparés dans le dossier `/packages` :
- le package `frontend` : le frontend de la plateforme, une SPA développée avec VueJS
- le package `api` : l'API REST qui alimente le frontend, développée avec NodeJS (Express)

## 🛠 Pré-requis

- le dépôt [resorption-bidonvilles-deploy](https://github.com/MTES-MCT/resorption-bidonvilles-deploy), correctement installé et configuré pour une instance de développement
- nodejs (14.x)
- yarn (1.22.x)

## 🔌 Initialisation
Une fois ce dépôt clôné sur votre machine :
- installez les dépendances communes à tous les packages : `yarn install`
- installez les dépendances internes des packages via l'outil `lerna` : `yarn lerna bootstrap`

Cette courte initialisation permet :
- d'installer toutes les dépendances techniques nécessaires
- de configurer les pre-commit et pre-push hooks grâce à l'outil `husky`

Vous êtes prêt(e)s à travailler !

## 🙇🏼 Contributeur(ices)

| <img src="https://avatars3.githubusercontent.com/u/1801091?v=3" width="120px;"/><br /><sub><b>Anis Safine Laget</b></sub> | <img src="https://avatars3.githubusercontent.com/u/50863659?v=3" width="120px;"/><br /><sub><b>Christophe Bénard</b></sub> | <img src="https://avatars3.githubusercontent.com/u/5053593?v=3" width="120px;"/><br /><sub><b>Gaël Destrem</b></sub> | <img src="https://avatars3.githubusercontent.com/u/94321132?v=3" width="120px;"/><br /><sub><b>Grégoire Thomazeau</b></sub> | <img src="https://avatars3.githubusercontent.com/u/34971399?v=3" width="120px;"/><br /><sub><b>Gilles Cognin</b></sub> |
| :---: | :---: | :---: | :---: | :---: |

## 📝 Licence
Ce projet est distribué sous license [AGPL-3.0](LICENSE).