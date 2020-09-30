<template>
    <PublicLayout :stickyHeader="false">
        <PublicContainer class="py-16">
            <div class="max-w-xl mx-auto">
                <h1 class="text-display-xl">Contactez nous</h1>

                <ValidationObserver ref="form" v-slot="{ handleSubmit, errors }">
                    <form class="max-w-xl mt-12" @submit.prevent="handleSubmit(submitForm)">
                        <InputGroup>
                            <TextInput label="Votre email" v-model="commonFields.email" id="email" validationName="Email" rules="required" />
                            <TextInput label="Prénom" v-model="commonFields.first_name" id="first_name" name="Prénom" rules="required" />
                            <TextInput label="Nom de famille" v-model="commonFields.last_name" id="last_name" name="Nom de famille" rules="required" />
                        </InputGroup>
                        <CheckableGroup title="Vous souhaitez..." name="Vous souhaitez..." rules="required" id="request_type">
                            <Radio checkValue="help" label="Aider" v-model="commonFields.request_type" />
                            <Radio checkValue="report" label="Signaler" v-model="commonFields.request_type" />
                            <Radio checkValue="help-request" label="Demander de l'aide" v-model="commonFields.request_type" />
                            <Radio checkValue="info-request" label="Demander des infos" v-model="commonFields.request_type" />
                            <Radio checkValue="access-request" label="Demander un accès à la plateforme" v-model="commonFields.request_type" />
                        </CheckableGroup>
                        <CheckableGroup v-show="commonFields.request_type === 'access-request'" title="Etes vous un acteur de la résorption des bidonvilles ? " info="Par exemple : un service de l'état, un opérateur associatif, une collectivité locale..." rules="required" id="access_request">
                            <Radio checkValue="yes" label="Oui" v-model="commonFields.is_actor" />
                            <Radio checkValue="no" label="Non" v-model="commonFields.is_actor" />
                        </CheckableGroup>
                        <CheckableGroup v-show="commonFields.is_actor === 'yes'" title="Quelle est votre structure ?" rules="required" id="is_actor">
                            <Radio v-model="requestAccessFields.organization_category" checkValue="public_establishment" label="Service de l'État, établissement ou organisme public"></Radio>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="territorial_collectivity" label="Collectivité territoriale"></Radio>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="association" label="Association"></Radio>
                            <Radio v-model="requestAccessFields.organization_category" checkValue="administration" label="Admnistration centrale"></Radio>
                        </CheckableGroup>

                        <PublicEstablishmentForm
                                v-show="requestAccessFields.organization_category === 'public_establishment' && commonFields.is_actor === 'yes'"
                                :organizationType.sync="publicEstablishmentFields.organization_type"
                                :organizationTerritory.sync="publicEstablishmentFields.organization_public"
                                :organizationFunction.sync="requestAccessFields.position"
                        />
                        <TerritorialCollectivityForm
                                v-show="requestAccessFields.organization_category === 'territorial_collectivity'  && commonFields.is_actor === 'yes'"
                                :collectivityName.sync="territorialCollectivityFields.territorial_collectivity"
                                :collectivityFunction.sync="requestAccessFields.position"
                        />
                        <AssociationForm
                                v-show="requestAccessFields.organization_category === 'association'  && commonFields.is_actor === 'yes'"
                                :associationName.sync="associationFields.association"
                                :associationTerritory.sync="associationFields.departement"
                                :associationFunction.sync="associationFields.position"
                                :newAssociationName.sync="associationFields.newAssociationName"
                                :newAssociationAcronym.sync="associationFields.newAssociationAbbreviation"
                        />
                        <AdministrationForm
                                v-show="requestAccessFields.organization_category === 'administration'  && commonFields.is_actor === 'yes'"
                                :administrationName.sync="administrationFields.organization_administration"
                                :administrationFunction.sync="requestAccessFields.position"
                        />

                        <TextArea label="Votre message" v-model="commonFields.access_request_message" rules="required" id="access_request_message" />
                        <CheckableGroup  v-slot="{ errors }" validationName="Accord" rules="required" id="legal">
                            <Checkbox checkValue="confirm" label="Je certifie que ces données personnelles ont été saisies avec mon accord" v-model="commonFields.legal" />
                        </CheckableGroup>


                        <div v-if="error" class="bg-red-200 p-3 mb-8" >
                            Votre demande d'accès n'a pas pu être envoyée : {{error.user_message}}

                            <ul class="mt-4">
                                <li v-for="(error, inputId) in errors" v-show="error.length">
                                    <router-link class="link" :to="{ hash: inputId }">{{error[0]}}</router-link>
                                </li>
                            </ul>
                        </div>


                        <Button type="submit" variant="primary" :loading="loading">Envoyer</Button>

                    </form>
                </ValidationObserver>
            </div>

        </PublicContainer>
    </PublicLayout>
</template>

<script>
    import { create } from '#helpers/api/user';
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
        methods: {
          async submitForm() {
              const isRequestAccess = this.commonFields.request_type === 'access-request' && this.commonFields.is_actor === 'yes'

              const data = {
                  ...this.commonFields,
                  legal: this.commonFields.legal.length > 0,
                  ...(isRequestAccess ? this.requestAccessFields: {}),
                  ...(isRequestAccess && this.requestAccessFields.organization_category === 'public_establishment' ? this.publicEstablishmentFields: {}),
                  ...(isRequestAccess && this.requestAccessFields.organization_category === 'territorial_collectivity' ? this.territorialCollectivityFields: {}),
                  ...(isRequestAccess && this.requestAccessFields.organization_category === 'association' ? this.associationFields: {}),
                  ...(isRequestAccess && this.requestAccessFields.organization_category === 'administration' ? this.administrationFields: {}),
              }

              this.loading = true
              try {
                  await create(data)
                  this.loading = false
                  this.$router.push('/');
                  notify({
                      group: 'notifications',
                      type: 'success',
                      title: 'Succès',
                      text: 'Votre demande d\'accès a été envoyée',
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
                  newAssociationName: '',
                  newAssociationAbbreviation: ''
              },
              administrationFields: {
                  organization_administration: ''
              }
          }
        },
    };
</script>
