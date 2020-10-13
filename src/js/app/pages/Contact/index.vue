<template>
  <PublicLayout
    :sticky-header="false"
    class="contact"
  >
    <PublicContainer class="py-16">
      <div class="max-w-xl mx-auto">
        <h1 class="text-display-xl">
          Contactez-nous
        </h1>

        <ValidationObserver
          ref="form"
          v-slot="{ handleSubmit, errors }"
        >
          <form
            class="max-w-xl mt-12"
            @submit.prevent="handleSubmit(submitForm)"
          >
            <InputGroup>
              <TextInput
                id="email"
                v-model="commonFields.email"
                label="Votre email"
                validation-name="Email"
                rules="required|email"
              />
              <TextInput
                id="first_name"
                v-model="commonFields.first_name"
                label="Prénom"
                name="Prénom"
                rules="required"
              />
              <TextInput
                id="last_name"
                v-model="commonFields.last_name"
                label="Nom de famille"
                name="Nom de famille"
                rules="required"
              />
            </InputGroup>
            <CheckableGroup
              id="request_type"
              title="Vous souhaitez..."
              name="Vous souhaitez..."
              rules="required"
              direction="row"
            >
              <Checkbox
                v-model="commonFields.request_type"
                check-value="help"
                label="Aider"
                variant="card"
              />
              <Checkbox
                v-model="commonFields.request_type"
                check-value="report"
                label="Signaler"
                variant="card"
              />
              <Checkbox
                v-model="commonFields.request_type"
                check-value="help-request"
                label="Demander de l'aide"
                variant="card"
              />
              <Checkbox
                v-model="commonFields.request_type"
                check-value="info-request"
                label="Demander des infos"
                variant="card"
              />
              <Checkbox
                v-model="commonFields.request_type"
                check-value="access-request"
                label="Demander un accès à la plateforme"
                variant="card"
              />
            </CheckableGroup>
            <CheckableGroup
              v-if="isRequestAccess"
              id="access_request"
              title="Etes vous un acteur de la résorption des bidonvilles ? "
              info="Par exemple : un service de l'état, un opérateur associatif, une collectivité locale..."
              rules="required"
              direction="row"
            >
              <Radio
                v-model="commonFields.is_actor"
                :check-value="true"
                label="Oui"
                variant="card"
              />
              <Radio
                v-model="commonFields.is_actor"
                :check-value="false"
                label="Non"
                variant="card"
              />
            </CheckableGroup>
            <CheckableGroup
              v-if="isRequestAccessAndActor"
              id="is_actor"
              title="Quelle est votre structure ?"
              rules="required"
            >
              <Radio
                v-model="requestAccessFields.organization_category"
                check-value="public_establishment"
                label="Service de l'État, établissement ou organisme public"
                variant="card"
              />
              <Radio
                v-model="requestAccessFields.organization_category"
                check-value="territorial_collectivity"
                label="Collectivité territoriale"
                variant="card"
              />
              <Radio
                v-model="requestAccessFields.organization_category"
                check-value="association"
                label="Association"
                variant="card"
              />
              <Radio
                v-model="requestAccessFields.organization_category"
                check-value="administration"
                label="Admnistration centrale"
                variant="card"
              />
            </CheckableGroup>

            <PublicEstablishmentForm
              v-if="isPublicEstablishmentRequest"
              :organization-type.sync="publicEstablishmentFields.organization_type"
              :organization-territory.sync="publicEstablishmentFields.organization_public"
              :organization-function.sync="requestAccessFields.position"
            />
            <TerritorialCollectivityForm
              v-if="isTerritorialCollectivityRequest"
              :collectivity-name.sync="territorialCollectivityFields.territorial_collectivity"
              :collectivity-function.sync="requestAccessFields.position"
            />
            <AssociationForm
              v-if="isAssociationRequest"
              :association-name.sync="associationFields.association"
              :association-territory.sync="associationFields.departement"
              :association-function.sync="associationFields.position"
              :new-association-name.sync="associationFields.new_association_name"
              :new-association-acronym.sync="associationFields.new_association_abbreviation"
            />
            <AdministrationForm
              v-if="isAdministrationRequest"
              :administration-name.sync="administrationFields.organization_administration"
              :administration-function.sync="requestAccessFields.position"
            />

            <TextArea
              id="access_request_message"
              v-model="commonFields.access_request_message"
              label="Votre message"
            />
            <CheckableGroup
              id="legal"
              validation-name="Accord"
              rules="required"
            >
              <Checkbox
                v-model="commonFields.legal"
                check-value="confirm"
                label="Je certifie que ces données personnelles ont été saisies avec mon accord"
              />
            </CheckableGroup>

            <div
              v-if="Object.values(errors).filter(err => err.length).length"
              class="bg-red-200 p-3 mb-8"
            >
              Votre demande d'accès comprend des erreurs:

              <ul class="mt-4">
                <li
                  v-for="(error, inputId) in errors"
                  v-show="error.length"
                  :key="inputId"
                >
                  <router-link
                    class="link"
                    :to="{ hash: inputId }"
                  >
                    {{ error[0] }}
                  </router-link>
                </li>
              </ul>
            </div>

            <div class="flex justify-between mt-8">
              <router-link to="/">
                <Button variant="primaryText">
                  Annuler
                </Button>
              </router-link>
              <Button
                type="submit"
                variant="primary"
                :loading="loading"
              >
                Envoyer
              </Button>
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
import PublicLayout from '#app/components/PublicLayout';
import PublicContainer from '#app/components/PublicLayout/PublicContainer';
import PublicEstablishmentForm from './PublicEstablishmentForm.vue';
import TerritorialCollectivityForm from './TerritorialCollectivityForm.vue';
import AssociationForm from './AssociationForm.vue';
import AdministrationForm from './AdministrationForm.vue';
import CheckableGroup from '#app/components/ui/primitives/input/CheckableGroup';
import Checkbox from '#app/components/ui/primitives/input/Checkbox';

export default {
    components: {
        Checkbox, CheckableGroup, PublicContainer, PublicLayout, PublicEstablishmentForm, TerritorialCollectivityForm, AdministrationForm, AssociationForm,
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
                new_association_abbreviation: '',
            },
            administrationFields: {
                organization_administration: '',
            },
        };
    },
    computed: {
        isRequestAccess() {
            return this.commonFields.request_type.includes('access-request');
        },
        isRequestAccessAndActor() {
            return this.isRequestAccess && this.commonFields.is_actor;
        },
        isPublicEstablishmentRequest() {
            return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'public_establishment';
        },
        isTerritorialCollectivityRequest() {
            return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'territorial_collectivity';
        },
        isAssociationRequest() {
            return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'association';
        },
        isAdministrationRequest() {
            return this.isRequestAccessAndActor && this.requestAccessFields.organization_category === 'administration';
        },
    },
    methods: {
        async submitForm() {
            const data = {
                ...this.commonFields,
                legal: this.commonFields.legal.length > 0,
                is_actor: !!this.commonFields.is_actor,
                ...(this.isRequestAccessAndActor ? this.requestAccessFields : {}),
                ...(this.isPublicEstablishmentRequest ? this.publicEstablishmentFields : {}),
                ...(this.isTerritorialCollectivityRequest ? this.territorialCollectivityFields : {}),
                ...(this.isAssociationRequest ? this.associationFields : {}),
                ...(this.isAdministrationRequest ? this.administrationFields : {}),
            };

            this.loading = true;
            try {
                await contact(data);
                this.loading = false;
                this.$router.push('/');
                notify({
                    group: 'notifications',
                    type: 'success',
                    title: 'Succès',
                    text: this.isRequestAccessAndActor ? 'Votre demande d\'accès a été envoyée' : 'Votre message a bien été envoyé',
                });
            } catch (err) {
                this.loading = false;
                this.error = err;
                this.$refs.form.setErrors(err.fields);
            }
        },
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
