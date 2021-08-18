<template>
    <PrivateLayout>
        <div class="max-w-xl mx-auto py-16">
            <h2 class="text-display-lg mb-4">
                Créer un utilisateur
            </h2>
            <ValidationObserver ref="form" v-slot="{ handleSubmit, errors }">
                <form
                    class="max-w-xl mt-12"
                    @submit.prevent="handleSubmit(submitForm)"
                >
                    <div class="text-display-md">
                        Informations personnelles
                    </div>
                    <InputGroup>
                        <TextInput
                            label="Nom"
                            showMandatoryStar
                            v-model="commonFields.last_name"
                            id="last_name"
                            name="Nom de famille"
                            rules="required"
                        />
                        <TextInput
                            label="Prénom"
                            showMandatoryStar
                            v-model="commonFields.first_name"
                            id="first_name"
                            name="Prénom"
                            rules="required"
                        />
                        <TextInput
                            label="Courriel"
                            v-model="commonFields.email"
                            showMandatoryStar
                            id="email"
                            validationName="Courriel"
                            rules="required|email"
                        />
                        <TextInput
                            label="Téléphone"
                            v-model="commonFields.phone"
                            id="phone"
                        />
                    </InputGroup>

                    <div class="text-display-md">Structure</div>
                    <InputGroup>
                        <CheckableGroup
                            label="Quelle est la structure de l'utilisateur?"
                            showMandatoryStar
                            rules="required"
                            id="organization_category"
                        >
                            <Radio
                                v-model="
                                    requestAccessFields.organization_category
                                "
                                checkValue="public_establishment"
                                label="Service de l’Etat, établissement ou organisme public"
                                variant="card"
                            />
                            <Radio
                                v-model="
                                    requestAccessFields.organization_category
                                "
                                checkValue="territorial_collectivity"
                                label="Collectivité territoriale"
                                variant="card"
                            />
                            <Radio
                                v-model="
                                    requestAccessFields.organization_category
                                "
                                checkValue="association"
                                label="Association"
                                variant="card"
                            />
                            <Radio
                                v-model="
                                    requestAccessFields.organization_category
                                "
                                checkValue="administration"
                                label="Administration centrale"
                                variant="card"
                            />
                        </CheckableGroup>
                    </InputGroup>

                    <PublicEstablishmentForm
                        v-if="isPublicEstablishmentRequest"
                        :organizationType.sync="
                            publicEstablishmentFields.organization_type
                        "
                        :organizationTerritory.sync="
                            publicEstablishmentFields.organization_public
                        "
                        :organizationFunction.sync="
                            requestAccessFields.position
                        "
                        functionLabel="Fonction de l'utilisateur"
                    />
                    <TerritorialCollectivityForm
                        v-if="isTerritorialCollectivityRequest"
                        :collectivityName.sync="
                            territorialCollectivityFields.territorial_collectivity
                        "
                        :collectivityFunction.sync="
                            requestAccessFields.position
                        "
                        functionLabel="Fonction de l'utilisateur"
                    />
                    <AssociationForm
                        v-if="isAssociationRequest"
                        :associationName.sync="associationFields.association"
                        :associationTerritory.sync="
                            associationFields.departement
                        "
                        :associationFunction.sync="associationFields.position"
                        :newAssociationName.sync="
                            associationFields.new_association_name
                        "
                        :newAssociationAcronym.sync="
                            associationFields.new_association_abbreviation
                        "
                        functionLabel="Fonction de l'utilisateur"
                    />
                    <AdministrationForm
                        v-if="isAdministrationRequest"
                        :administrationName.sync="
                            administrationFields.organization_administration
                        "
                        :administrationFunction.sync="
                            requestAccessFields.position
                        "
                        functionLabel="Fonction de l'utilisateur"
                    />

                    <CheckableGroup
                        validationName="Accord"
                        rules="required"
                        id="legal"
                    >
                        <Checkbox
                            checkValue="confirm"
                            label="Je certifie que ces données personnelles ont été saisies avec l'accord de leur propriétaire"
                            v-model="commonFields.legal"
                        />
                    </CheckableGroup>

                    <div
                        v-if="
                            Object.values(errors).filter(err => err.length)
                                .length
                        "
                        class="bg-red200 p-3 mb-8"
                    >
                        Votre demande comprend des erreurs:

                        <ul class="mt-4">
                            <li
                                v-for="(error, inputId) in errors"
                                :key="inputId"
                                v-show="error.length"
                            >
                                <router-link
                                    class="link"
                                    :to="{ hash: inputId }"
                                    >{{ error[0] }}</router-link
                                >
                            </li>
                        </ul>
                    </div>

                    <div class="flex justify-between mt-8">
                        <div />
                        <Button
                            type="submit"
                            variant="primary"
                            :loading="loading"
                            >Continuer</Button
                        >
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </PrivateLayout>
</template>

<script>
import { create } from "#helpers/api/user";
import PublicEstablishmentForm from "#app/components/UserForm/PublicEstablishmentForm.vue";
import TerritorialCollectivityForm from "#app/components/UserForm/TerritorialCollectivityForm.vue";
import AssociationForm from "#app/components/UserForm/AssociationForm.vue";
import AdministrationForm from "#app/components/UserForm/AdministrationForm.vue";
import CheckableGroup from "#app/components/ui/Form/CheckableGroup.vue";
import Checkbox from "#app/components/ui/Form/input/Checkbox.vue";
import TextInput from "#app/components/ui/Form/input/TextInput";
import PrivateLayout from "#app/components/PrivateLayout";

export default {
    components: {
        TextInput,
        Checkbox,
        CheckableGroup,
        PublicEstablishmentForm,
        TerritorialCollectivityForm,
        AdministrationForm,
        AssociationForm,
        PrivateLayout
    },
    computed: {
        isPublicEstablishmentRequest() {
            return (
                this.requestAccessFields.organization_category ===
                "public_establishment"
            );
        },
        isTerritorialCollectivityRequest() {
            return (
                this.requestAccessFields.organization_category ===
                "territorial_collectivity"
            );
        },
        isAssociationRequest() {
            return (
                this.requestAccessFields.organization_category === "association"
            );
        },
        isAdministrationRequest() {
            return (
                this.requestAccessFields.organization_category ===
                "administration"
            );
        }
    },
    methods: {
        async submitForm() {
            const data = {
                ...this.commonFields,
                ...this.requestAccessFields,
                legal: this.commonFields.legal.length > 0,
                ...(this.isPublicEstablishmentRequest
                    ? this.publicEstablishmentFields
                    : {}),
                ...(this.isTerritorialCollectivityRequest
                    ? this.territorialCollectivityFields
                    : {}),
                ...(this.isAssociationRequest ? this.associationFields : {}),
                ...(this.isAdministrationRequest
                    ? this.administrationFields
                    : {})
            };
            this.loading = true;
            try {
                // Create a user and send an email to admins
                const user = await create(data);
                this.loading = false;
                this.$router.push(`/nouvel-utilisateur/${user.id}`);
            } catch (err) {
                this.loading = false;
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
                email: this.$route.query.email || "",
                phone: "",
                first_name: "",
                last_name: "",
                legal: []
            },
            requestAccessFields: {
                organization_category: null,
                position: ""
            },
            publicEstablishmentFields: {
                organization_type: null,
                organization_public: null
            },
            territorialCollectivityFields: {
                territorial_collectivity: null
            },
            associationFields: {
                association: "",
                departement: "",
                new_association_name: "",
                new_association_abbreviation: ""
            },
            administrationFields: {
                organization_administration: ""
            }
        };
    }
};
</script>
