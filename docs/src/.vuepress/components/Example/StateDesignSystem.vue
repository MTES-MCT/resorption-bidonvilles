<template>
    <div class="mt-12 mb-12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
            <form @submit.prevent="handleSubmit">
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
                        <TextInput label="Addresse email" rules="required|email" />
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
                            <CheckableGroup direction="row" rules="required" validationName="Mr/Mme">
                                <Radio checkValue="mme" label="Mme." />
                                <Radio checkValue="mr" label="Mr." />
                            </CheckableGroup>
                            <TextInput label="Nom" rules="required" />
                            <TextInput label="Prénom" rules="required" />
                        </InputGroup>


                        <InputGroup title="Votre projet">
                            <TextInput label="Nature du projet"  rules="required" />
                            <TextInput label="Stade d'avancement" info="Initialisation - en cours - finalisation"  rules="required" />
                            <Select label="Public ciblé"  rules="required">
                                <SelectOption>a</SelectOption>
                                <SelectOption>b</SelectOption>
                            </Select>
                        </InputGroup>

                        <CheckableGroup title="Vos centres d'intérets"  rules="required">
                            <Checkbox checkValue="musique" label="La musique" />
                            <Checkbox checkValue="cinema" label="Le cinéma" />
                            <Checkbox checkValue="sport" label="Le sport " />
                        </CheckableGroup>

                        <Button>Valider mes informations</Button>
                    </FormGroup>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>
