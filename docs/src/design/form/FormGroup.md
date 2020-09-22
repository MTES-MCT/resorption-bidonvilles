# FormGroup

Composant qui encapsule les autres composants de formulaire (TextInput, Checkbox, Select, Radio) avec un label et un potentiel message d'erreur     

## Default

<FormGroup label="Username">
<TextInput name="username" placeholder="John Doe" />
</FormGroup>

```
<FormGroup label="Username">
    <TextInput name="username" placeholder="John Doe" />
</FormGroup>
```

## With Error

<FormGroup label="Username" error="Please enter an username">
<TextInput name="username" placeholder="John Doe" />
</FormGroup>

```
<FormGroup label="Username" error="Please enter an username">
    <TextInput name="username" placeholder="John Doe" />
</FormGroup>
```
