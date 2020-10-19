<template>
    <PublicLayout :stickyHeader="false" :displayLanguagePicker="true" class="contact">
        <PublicContainer class="py-16">
            <div class="max-w-3xl mx-auto">
              <h1 class="text-display-lg text-secondary mb-16">{{$t('contactPage.title')}}</h1>
            </div>

            <div class="max-w-xl mx-auto">
                <h2 class="text-display-md">{{$t('contactPage.contactUs')}}</h2>

                <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
                    <form class="max-w-xl mt-12" @submit.prevent="handleSubmit(submitForm)">
                        <InputGroup>
                            <TextInput :label="$t('contactPage.email')" v-model="commonFields.email" id="email" validationName="Email" rules="required|email" />
                            <TextInput :label="$t('contactPage.firstname')" v-model="commonFields.first_name" id="first_name" name="Prénom" rules="required" />
                            <TextInput :label="$t('contactPage.lastname')" v-model="commonFields.last_name" id="last_name" name="Nom de famille" rules="required" />
                        </InputGroup>
                        <CheckableGroup :title="$t('contactPage.requestType')" :name="$t('contactPage.requestType')" rules="required" id="request_type" direction="row">
                            <Checkbox checkValue="help" :label="$t('contactPage.help')" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="report" :label="$t('contactPage.report')" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="help-request" :label="$t('contactPage.requestHelp')" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="info-request" :label="$t('contactPage.requestInfo')" v-model="commonFields.request_type" variant="card" />
                            <Checkbox checkValue="access-request" :label="$t('contactPage.requestAccess')" v-model="commonFields.request_type" variant="card" />
                        </CheckableGroup>
                        <CheckableGroup v-if="isRequestAccess" :title="$t('contactPage.isActor')" :info="$t('contactPage.actorExample')" rules="required" id="access_request" direction="row">
                            <Radio :checkValue="true" :label="$t('contactPage.yes')" v-model="commonFields.is_actor" variant="card" />
                            <Radio :checkValue="false" :label="$t('contactPage.no')" v-model="commonFields.is_actor" variant="card" />
                        </CheckableGroup>
                        <CheckableGroup v-if="isRequestAccessAndActor" :title="$t('contactPage.whichEstablishment')" rules="required" id="is_actor" >
                            <Radio v-model="requestAccessFields.organization_category" checkValue="public_establishment" :label="$t('contactPage.public')" variant="card"/>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="territorial_collectivity" :label="$t('contactPage.territorialCollectivity')" variant="card"/>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="association" :label="$t('contactPage.association')" variant="card"/>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="administration" :label="$t('contactPage.administration')" variant="card"/>
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

                        <TextArea :label="$t('contactPage.message')" v-model="commonFields.access_request_message" id="access_request_message" />
                        <CheckableGroup  v-slot="{ errors }" validationName="Accord" rules="required" id="legal">
                            <Checkbox checkValue="confirm" :label="$t('contactPage.legal')" v-model="commonFields.legal" />
                        </CheckableGroup>


                        <div v-if="Object.values(errors).filter(err => err.length).length" class="bg-red-200 p-3 mb-8" >
                            {{$t('contactPage.error')}}

                            <ul class="mt-4">
                                <li v-for="(error, inputId) in errors" v-show="error.length">
                                    <router-link class="link" :to="{ hash: inputId }">{{error[0]}}</router-link>
                                </li>
                            </ul>
                        </div>


                        <div class="flex justify-between mt-8">

                            <router-link to="/"><Button variant="primaryText">{{$t('contactPage.cancel')}}</Button></router-link>
                            <Button type="submit" variant="primary" :loading="loading">{{$t('contactPage.send')}}</Button>
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
            isFrenchLocale() {
                return this.$i18n.locale === "fr"
            },
            isRequestAccess() {
                return this.commonFields.request_type.includes('access-request') && this.isFrenchLocale
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
    .contact {
        // TODO: A supprimer quand le composant d'autocomplete sera refait avec le nouveau design
        .autocompleter-textfield input {
            @apply border-2 border-G200 rounded-md  py-2 outline-none
        }

        .autocompleter-textfield input:focus {
            @apply border-primary
        }
    }

</style>
