# Couleurs - palette

<GithubLink docPath="fundamentals/Colors.md" />

La palette de couleurs du design system est définie par la charte graphique de l'État : elle permet de créer une cohérence entre les interfaces et offre une expérience optimale à l’utilisateur. Leur respect renforce également la reconnaissance de la parole de l’État.


## Palette de couleurs:


<div class="flex flex-row mb-4">
<Color color="blue700">blue700</Color>
<Color color="blue600">blue600 (primary)</Color>
<Color color="blue500">blue500</Color>
<Color color="blue400">blue400</Color>
<Color color="blue300">blue300</Color>
<Color color="blue200">blue200</Color>
<Color color="blue100">blue100</Color>
</div>

<div class="flex flex-row mb-4">
<Color color="orange700">orange700</Color>
<Color color="orange600">orange600 (secondary)</Color>
<Color color="orange500">orange500</Color>
<Color color="orange400">orange400</Color>
<Color color="orange300">orange300</Color>
<Color color="orange200">orange200</Color>
<Color color="orange100">orange100</Color>
</div>

<div class="flex flex-row mb-4">
<Color color="red700">red700</Color>
<Color color="red600">red600</Color>
<Color color="red500">red500</Color>
<Color color="red400">red400</Color>
<Color color="red300">red300</Color>
<Color color="red200">red200</Color>
<Color color="red100">red100</Color>
</div>

<div class="flex flex-row mb-4">
<Color color="G800">G800</Color>
<Color color="G750">G750</Color>
<Color color="G700">G700</Color>
<Color color="G600">G600</Color>
<Color color="G500">G500</Color>
<Color color="G400">G400</Color>
<Color color="G300">G300</Color>
<Color color="G200">G200</Color>
<Color color="G100">G100</Color>
</div>


## Couleurs fonctionnelles
<div class="grid grid-cols-3">
<Color color="success">success</Color>
<Color color="error">error</Color>
<Color color="info">info</Color>
</div>

## (Tech) Comment utiliser les couleurs?

Pour les textes, il faut préfixer le code couleur de `text-` et pour les backgrounds de `bg-`

### Exemple 
<div class="bg-orange300 h-24 w-24" />
<div class="text-blue300">text-blue300</div>

```
<div class="bg-orange300 h-24 w-24" />
<div class="text-blue300">text-blue300</div>
```

Il existe aussi quelques alias
```
primary => blue600
secondary => orange600
black => G800
```
