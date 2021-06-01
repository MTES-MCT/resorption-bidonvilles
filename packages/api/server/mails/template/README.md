Liste des mails: https://docs.google.com/spreadsheets/d/1nqbmtRR0tWBwZavK6hXffPofJffSXgwhakfgO4tKvYY/edit#gid=0

Les templates sont générés avec https://mjml.io/

Pour les modifier, il faut modifier la source et utiliser la commande yarn emails:build pour regénerer les fichiers html

## Variables

Mailjet supporte des variables : https://dev.mailjet.com/email/template-language/reference/

Les variables suivantes sont nécessaires à tous les mails:  
- frontURL => https://resorption-bidonvilles.beta.gouv.fr/  
- backURL => https://api.resorption-bidonvilles.beta.gouv.fr/  
- recipientName => user firstName + lastName

## Les URL sont variabilisés pour le tracking (différente campagne pour chaque mail)

Les autres variables utilisés plus spécifiques:

- inviterName => user firstName + lastName
- userName => user firstName + lastName
- adminName => user firstName + lastName
- activationURL => url d'activation  
- activationURLSentDate => date 
- activationURLExpDate => date
- siteURL => https://resorption-bidonvilles.beta.gouv.fr/#/site/406
- contactURL => https://resorption-bidonvilles.beta.gouv.fr/#/contact  
- formationURL => https://app.evalandgo.com/s/index.php?a=JTk2cCU5N2slOUElQjA=&id=JTk4ayU5QW4lOTYlQUY=
- idealcoURL => https://www.idealco.fr/campagne/?utm_campaign=g-386-3036d540
- adminURL => https://resorption-bidonvilles.beta.gouv.fr/#/liste-des-utilisateurs

## Tracking 

Tracking des activités proposées dans les mèls

Règles d’écriture des URL pour matomo
Beta.gouv utilise la version 3.13.5 de matimo.
Cette version n’utilise que 2 champs pour effectuer des campagnes de tracking dédiées: pk_campaign et pk_kwd.

ie: Me connecter: https://resorption-bidonvilles.beta.gouv.fr/#/connexion?pk_campaign=recap-activite-email&pk_kwd=dep13-31-05-2021 (valeur à variabiliser) 




 