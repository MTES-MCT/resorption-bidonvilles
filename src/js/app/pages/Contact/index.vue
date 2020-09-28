<template>
    <PublicLayout>
        <PublicContainer class="py-16">
            <div class="max-w-xl mx-auto">
                <h1 class="text-display-xl">Contactez nous</h1>

                <form class="max-w-xl mt-12" @submit.prevent="submitForm">
                    <InputGroup>
                        <TextInput label="Votre email" v-model="email" />
                        <TextInput label="Prénom" v-model="first_name" />
                        <TextInput label="Nom de famille" v-model="last_name" />
                    </InputGroup>
                    <CheckableGroup title="Vous souhaitez...">
                        <Radio checkValue="help" label="Aider" v-model="type" />
                        <Radio checkValue="report" label="Signaler" v-model="type" />
                        <Radio checkValue="help-request" label="Demander de l'aide" v-model="type" />
                        <Radio checkValue="info-request" label="Demander des infos" v-model="type" />
                        <Radio checkValue="access-request" label="Demander un accès à la plateforme" v-model="type" />
                    </CheckableGroup>
                    <CheckableGroup title="Etes vous un acteur de la résorption des bidonvilles ? " info="Par exemple : un service de l'état, un opérateur associatif, une collectivité locale...">
                        <Radio checkValue="yes" label="Oui" v-model="isActor" />
                        <Radio checkValue="no" label="Non" v-model="isActor" />
                    </CheckableGroup>
                    <CheckableGroup v-if="isActor === 'yes'" title="Quelle est votre structure ?">
                        <Radio v-model="category" checkValue="public_establishment" label="Service de l'État, établissement ou organisme public"></Radio>
                        <Radio v-model="category" checkValue="territorial_collectivity" label="Collectivité territoriale"></Radio>
                        <Radio v-model="category" checkValue="association" label="Association"></Radio>
                        <Radio v-model="category" checkValue="administration" label="Admnistration centrale"></Radio>
                    </CheckableGroup>

                    <PublicEstablishmentForm
                            v-if="category === 'public_establishment'"
                            :organizationType.sync="organization.type"
                            :organizationTerritory.sync="organization.territory"
                            :organizationFunction.sync="organization.function"
                    />
                    <TerritorialCollectivityForm
                            v-if="category === 'territorial_collectivity'"
                            :collectivityName.sync="collectivity.name"
                            :collectivityFunction.sync="collectivity.function"
                    />
                    <AssociationForm
                            v-if="category === 'association'"
                            :associationName.sync="association.name"
                            :associationTerritory.sync="association.territory"
                            :associationFunction.sync="association.function"
                            :newAssociationName.sync="association.newName"
                            :newAssociationAcronym.sync="association.newAcronym"
                    />
                    <AdministrationForm
                            v-if="category === 'administration'"
                            :administrationName.sync="administration.name"
                            :administrationFunction.sync="administration.function"
                    />

                    <TextArea label="Votre message" v-model="message" />
                    <CheckableGroup>
                        <Checkbox checkValue="confirm" label="Je certifie que ces données personnelles ont été saisies avec mon accord" v-model="confirmCheckbox" />
                    </CheckableGroup>
                    <Button type="primary">Envoyer</Button>
                </form>
            </div>

        </PublicContainer>
    </PublicLayout>
</template>

<script>
    import PublicLayout from '#app/components/PublicLayout'
    import PublicContainer from '#app/components/PublicLayout/PublicContainer'
    import PublicEstablishmentForm from './PublicEstablishmentForm'
    import TerritorialCollectivityForm from './TerritorialCollectivityForm'
    import AssociationForm from './AssociationForm'
    import AdministrationForm from './AdministrationForm'

    export default {
        components: { PublicContainer, PublicLayout, PublicEstablishmentForm, TerritorialCollectivityForm, AdministrationForm, AssociationForm },
        methods: {
          submitForm() {
              console.log(this);
          }
        },
        data() {
          return {
              email: '',
              first_name: '',
              last_name: '',
              category: null,
              isActor: null,
              message: '',
              type: null,
              confirmCheckbox: [false],
              organization: {
                  type: null,
                  territory: null,
                  function: ''
              },
              collectivity: {
                  name: null,
                  function: '',
              },
              association: {
                  name: null,
                  territory: null,
                  function: '',
                  newName: '',
                  newAcronym: ''
              },
              administration: {
                  name: '',
                  function: '',
              }
          }
        },
    };
</script>
