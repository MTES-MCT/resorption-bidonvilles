# Typographie

<GithubLink docPath="fundamentals/Typography.md" />

Les typographies Marianne® et Spectral sont les typographies officielles de la charte de l'État 🔗. Leur usage crée une cohérence entre les interfaces et offre une expérience positive à l’utilisateur. Leur respect renforce également la reconnaissance de la parole de l’État.

## Headings

| Éléments | Utilisation                                                                                                                                                                                      | Classe CSS       | Attributs                                                 |
|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------------------------------------|
| H1       | <span class='text-display-xl'>Titre principal de la page : il ne peut y en avoir qu’un par page.</span>                                                                                          | .text-display-xl | Pixel : 48 Rem : 2.75 Line height : 1.25 Couleur : G800   |
| H2       | <span class='text-display-lg'>Second niveau de titre de section/paragraphes. Leur nombre ne sont pas limité.  Ils permettent de hiérarchiser les sections de texte et de paragraphes</span>      | .text-display-lg | Pixel : 32 Rem : 2 Line height : 1.25 Couleur : G800      |
| H3       | <span class='text-display-md'>Troisième niveau sous-titre de section/paragraphes. Leur nombre ne sont pas limité. Ils permettent de hiérarchiser les sections de texte et de paragraphes.</span> | .text-display-md | Pixel : 24 Rem : 1.5 Line height : 1.25 Couleur : G800    |
| H4       | <span class='text-display-sm'>Quatrième niveau et plus petit niveau de sous-titre. Leur nombre ne sont pas limité.</span>                                                                        | .text-display-sm | Pixel : 22 Rem : 1.375 Line height : 1.375 Couleur : G800 |


## Corps de texte

| Éléments     | Utilisation                                                                                                                                                            | Classe CSS | Attributs                                               |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|---------------------------------------------------------|
| XL           | <span class='text-xl'>à utiliser pour les introductions ou accroches.</span>                                                                                           | .text-xl   | Pixel : 24 Rem : 1.5 Line height : 1.375 Couleur : G700 |
| LG           | <span class='text-lg'>Corps de texte réservé aux usages éditoriaux (type : actualités, blog) afin d’amener un plus grand confort de lecture.</span>                    | .text-lg   | Pixel : 20 Rem : 1.5 Line height : 1.25 Couleur : G700  |
| MD / Default | <span class='text-md'>À utiliser en corps de texte uniquement au sein de certains composants.</span>                                                                   | .text-md   | Pixel : 16 Rem : 1 Line height : 1.5 Couleur : G700     |
| SM           | <span class="text-sm">À utiliser en corps de texte uniquement au sein de certains composants.</span>                                                                   | .text-sm   | Pixel : 14 Rem : 0.875 Line height : 1.5 Couleur : G700 |
| XS           | <span class='text-xs'>À utiliser pour les mentions, légendes ou autres informations mineures, qui ne doivent pas perturber la lecture de l’information.</span>         | .text-xs   | Pixel : 12 Rem : 0.75 Line height : 1.5 Couleur : G600  |

## Personalisation des titres/textes

Il est possible d'utiliser des classes pour modifier la couleur ou la graisse d'un texte avec les classes suivantes

<Text-ColorsExample />
<Text-WeightExample />

```
<div class="text-display-lg text-primary">Text primary</div>
<div class="text-display-lg text-secondary">Text secondary</div>
<div class="text-display-xl font-normal">Display XL normal</div>
<div class="text-display-xl font-light">Display XL Light</div>
```


