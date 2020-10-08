# FormGroup / InputGroup

Wrapper avec titre autour d'inputs     

## Default

<FormGroup-Example />

```
<template>
    <FormGroup title="Titre groupe de champs" class="max-w-sm">
        <InputGroup title="Vos informations personnelles">
            <TextInput label="Nom" />
            <TextInput label="Prénom" />
        </InputGroup>


        <InputGroup title="Votre projet">
            <TextInput label="Nature du projet" />
            <TextInput label="Stade d'avancement" info="Initialisation - en cours - finalisation" />
            <Select label="Public ciblé">
                <SelectOption>a</SelectOption>
                <SelectOption>b</SelectOption>
            </Select>
        </InputGroup>
    </FormGroup>
</template>

```
