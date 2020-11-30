# (Tech) Validations des formulaires

La validation des formulaires s'appuie sur la librairie [VeeValidate](https://logaretm.github.io/vee-validate/overview.html). Cette librairie à une approche déclarative et permet de définir les règles de validation au niveau du template et des inputs.

### Exemple basique avec VeeValidate

<FormValidation-Example />

```
<ValidationProvider v-slot="{ errors }" rules="required|email" name="email">
    <input v-model="value" type="text">
    <span>{{ errors[0] }}</span>
</ValidationProvider>
```

La liste des différentes règles disponibles sont définies [ici](https://logaretm.github.io/vee-validate/guide/rules.html#importing-the-rules). Il est également possible de rajouter de nouvelles règles personalisées.

### Implémentation

Les composants d'input du design system abstraient la gestion d'erreur et ne nécessitent de passer uniquement la propriété rules :
- TextInput
- Select
- CheckableGroup
- Autocomplete
- Datepicker  
  

L'exemple précédent peut être ainsi être reproduit de la manière suivante

<FormValidation-Example2 />

```
<TextInput label="Email" v-model="value" rules="required|email" />
```

### Validation de formulaire

Les formulaires sont souvent composés de plusieurs champs, pour gérer l'état du formulaire, VeeValidate fournit un composant [ValidationObserver](https://logaretm.github.io/vee-validate/api/validation-observer.html#scoped-slot-props) qui encapsule les formulaires et permet d'avoir un état de validation du formulaire.

```
<template>
    <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
        <form @submit.prevent="handleSubmit(onSubmit)">
            <TextInput id="email" type="text" placeholder="Username" v-model="username" label="Username" :error="errors.username" rules="required"/>
            <TextInput id="password" type="password" placeholder="******************" v-model="password" label="Password" :error="errors.password" rules="required"/>
            <Button variant="primary" type="submit">
                Sign in
            </Button>
        </form>
    </ValidationObserver> 
</template>

```

### Gestion d'erreurs retourné par une API

Imaginons qu'à partir de l'exemple précédent, le mot de passe n'est pas valide et que l'API retourne une erreur au format suivant

```
{
    error: {
        fields: {
            password: ['Le mot de passe est invalide']
        }
    }
}
```

Le composant ValidationObserver permet de définir des erreurs au niveau du formulaire en utilisant la méthode `setErrors` qui accepte un objet contenant des erreurs pour chaque champ (cf: [Settings Errors Manually](https://logaretm.github.io/vee-validate/advanced/server-side-validation.html#setting-errors-manually))

```
<script>
export default {
     methods: {
        onSubmit() {
            try {
                // Retourne une 400 car password invalide
                await postLogin(this.email, this.password)
            } catch (err) {
                this.$refs.form.setErrors(err.error.fields);
            }
        }
    }
}
</script>
```



### Personalisation des messages

Les messages sont définis au niveau [des règles de VeeValidate](https://logaretm.github.io/vee-validate/guide/basics.html#messages) 

 



