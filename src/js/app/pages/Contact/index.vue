<template>
    <PublicLayout :stickyHeader="false">
        <PublicContainer class="py-16">
            <div class="max-w-xl mx-auto">
                <h1 class="text-display-xl">Contactez-nous</h1>

                <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
                    <form class="max-w-xl mt-12" @submit.prevent="handleSubmit(submitForm)">
                        <InputGroup>
                            <TextInput label="Votre email" v-model="commonFields.email" id="email" validationName="Email" rules="required|email" />
                            <TextInput label="Prénom" v-model="commonFields.first_name" id="first_name" name="Prénom" rules="required" />
                            <TextInput label="Nom de famille" v-model="commonFields.last_name" id="last_name" name="Nom de famille" rules="required" />
                        </InputGroup>
                        <CheckableGroup title="Vous souhaitez..." name="Vous souhaitez..." rules="required" id="request_type" direction="row">
                            <Checkbox checkValue="help" label="Aider" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="report" label="Signaler" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="help-request" label="Demander de l'aide" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="info-request" label="Demander des infos" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="access-request" label="Demander un accès à la plateforme" v-model="commonFields.request_type" variant="card" />
                        </CheckableGroup>
                        <CheckableGroup v-if="isRequestAccess" title="Etes vous un acteur de la résorption des bidonvilles ? " info="Par exemple : un service de l'état, un opérateur associatif, une collectivité locale..." rules="required" id="access_request" direction="row">
                            <Radio :checkValue="true" label="Oui" v-model="commonFields.is_actor" variant="card" />
                            <Radio :checkValue="false" label="Non" v-model="commonFields.is_actor" variant="card" />
                        </CheckableGroup>
                        <CheckableGroup v-if="isRequestAccessAndActor" title="Quelle est votre structure ?" rules="required" id="is_actor" >
                            <Radio v-model="requestAccessFields.organization_category" checkValue="public_establishment" label="Service de l'État, établissement ou organisme public" variant="card"/>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="territorial_collectivity" label="Collectivité territoriale" variant="card"/>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="association" label="Association" variant="card"/>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="administration" label="Admnistration centrale" variant="card"/>
                        </CheckableGroup>

                        <PublicEstablishmentForm
                                v-if="isPublicEstablishmentRequest"
                                :organizationType.sync="publicEstablishmentFields.organization_type"
                                :organizationTerritory.sync="publicEstablishmentFields.organization_public"
                                :organizationFunction.sync="requestAccessFields.position"
                        />
                        <TerritorialCollectivityForm
                                v-if="isTerritorialCollectivityRequest"
                                :collectivityName.sync="territorialCollectivityFields.territorial_collectivity"
                                :collectivityFunction.sync="requestAccessFields.position"
                        />
                        <AssociationForm
                                v-if="isAssociationRequest"
                                :associationName.sync="associationFields.association"
                                :associationTerritory.sync="associationFields.departement"
                                :associationFunction.sync="associationFields.position"
                                :newAssociationName.sync="associationFields.new_association_name"
                                :newAssociationAcronym.sync="associationFields.new_association_abbreviation"
                        />
                        <AdministrationForm
                                v-if="isAdministrationRequest"
                                :administrationName.sync="administrationFields.organization_administration"
                                :administrationFunction.sync="requestAccessFields.position"
                        />

                        <TextArea label="Votre message" v-model="commonFields.access_request_message" id="access_request_message" />
                        <CheckableGroup  v-slot="{ errors }" validationName="Accord" rules="required" id="legal">
                            <Checkbox checkValue="confirm" label="Je certifie que ces données personnelles ont été saisies avec mon accord" v-model="commonFields.legal" />
                        </CheckableGroup>


                        <div v-if="Object.values(errors).filter(err => err.length).length" class="bg-red-200 p-3 mb-8" >
                            Votre demande d'accès comprend des erreurs:

                            <ul class="mt-4">
                                <li v-for="(error, inputId) in errors" v-show="error.length">
                                    <router-link class="link" :to="{ hash: inputId }">{{error[0]}}</router-link>
                                </li>
                            </ul>
                        </div>


                        <div class="flex justify-between mt-8">

                            <router-link to="/"><Button variant="primaryText">Annuler</Button></router-link>
                            <Button type="submit" variant="primary" :loading="loading">Envoyer</Button>
                        </div>


                    </form>
                </ValidationObserver>
            </div>

        </PublicContainer>
    </PublicLayout>
</template>

<script>
    import { contact } from '#helpers/api/contact';
    import { notify } from '#helpers/notificationHelper';
    import PublicLayout from '#app/components/PublicLayout'
    import PublicContainer from '#app/components/PublicLayout/PublicContainer'
    import PublicEstablishmentForm from './PublicEstablishmentForm'
    import TerritorialCollectivityForm from './TerritorialCollectivityForm'
    import AssociationForm from './AssociationForm'
    import AdministrationForm from './AdministrationForm'
    import CheckableGroup from '#app/components/ui/primitives/input/CheckableGroup';
    import Checkbox from '#app/components/ui/primitives/input/Checkbox';

    export default {
        components: { Checkbox, CheckableGroup, PublicContainer, PublicLayout, PublicEstablishmentForm, TerritorialCollectivityForm, AdministrationForm, AssociationForm },
        computed: {
            isRequestAccess() {
                return this.commonFields.request_type.includes('access-request')
            },
            isRequestAccessAndActor() {
                return this.isRequestAccess && this.commonFields.is_actor
            },
            isPublicEstablishmentRequest() {
                return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'public_establishment'
            },
            isTerritorialCollectivityRequest() {
                return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'territorial_collectivity'
            },
            isAssociationRequest() {
                return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'association'
            },
            isAdministrationRequest() {
                return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'administration'
            }
        },
        methods: {
          async submitForm() {
              const data = {
                  ...this.commonFields,
                  legal: this.commonFields.legal.length > 0,
                  is_actor: !!this.commonFields.is_actor,
                  ...(this.isRequestAccessAndActor ? this.requestAccessFields: {}),
                  ...(this.isPublicEstablishmentRequest ? this.publicEstablishmentFields: {}),
                  ...(this.isTerritorialCollectivityRequest ? this.territorialCollectivityFields: {}),
                  ...(this.isAssociationRequest ? this.associationFields: {}),
                  ...(this.isAdministrationRequest ? this.administrationFields: {}),
              }

              this.loading = true
              try {
                  await contact(data)
                  this.loading = false
                  this.$router.push('/');
                  notify({
                      group: 'notifications',
                      type: 'success',
                      title: 'Succès',
                      text: this.isRequestAccessAndActor ? 'Votre demande d\'accès a été envoyée' : 'Votre message a bien été envoyé' ,
                  });

              } catch (err) {
                  this.loading = false
                  this.error = err;
                  this.$refs.form.setErrors(err.fields);
              }

          }
        },
        data() {

          return {
              loading: false,
              error: null,
              commonFields: {
                  email: this.$route.query.email || '',
                  first_name: '',
                  last_name: '',
                  request_type: [],
                  legal: [],
                  is_actor: null,
                  access_request_message: '',
              },
              requestAccessFields: {
                  organization_category: null,
                  position: '',
              },
              publicEstablishmentFields: {
                  organization_type: null,
                  organization_public: null,
              },
              territorialCollectivityFields: {
                  territorial_collectivity: null,
              },
              associationFields: {
                  association: '',
                  departement: '',
                  new_association_name: '',
                  new_association_abbreviation: ''
              },
              administrationFields: {
                  organization_administration: ''
              }
          }
        },
    };
</script>

<style lang="scss">
    // TODO: A supprimer quand le composant d'autocomplete sera refait avec le nouveau design
    .autocompleter-textfield input {
        @apply border-2 border-G200 rounded-md w-full py-2 px-4 outline-none
    }

    .autocompleter-textfield input:focus {
        @apply border-primary
    }
</style>
