<template>
    <div class="mt-12 mb-12">
        <div>
            <div class="text-display-xl">Formulaires</div>

            <FormParagraph class="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </FormParagraph>
        </div>


        <div class="mb-12">
            <div class="text-display-lg">Champs de saisie</div>
            <FormParagraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </FormParagraph>
            <FormGroup>
                <TextInput label="Addresse email" />
                <Button>S'inscrire à la newsletter</Button>
            </FormGroup>

        </div>

        <div class="mb-12">
            <div class="text-display-lg">Groupes de champs de saisie</div>
            <FormParagraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </FormParagraph>
            <FormGroup title="Titre groupe de champs" class="max-w-sm">
                <InputGroup title="Vos informations personnelles">
                    <CheckableGroup direction="row" error="test">
                        <Radio checkValue="mme" label="Mme." />
                        <Radio checkValue="mr" label="Mr." />
                    </CheckableGroup>
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

                <CheckableGroup title="Vos centres d'intérets">
                    <Checkbox checkValue="musique" label="La musique" />
                    <Checkbox checkValue="cinema" label="Le cinéma" />
                    <Checkbox checkValue="sport" label="Le sport " />
                </CheckableGroup>

                <Button>Valider mes informations</Button>
            </FormGroup>
        </div>

    </div>
</template>
