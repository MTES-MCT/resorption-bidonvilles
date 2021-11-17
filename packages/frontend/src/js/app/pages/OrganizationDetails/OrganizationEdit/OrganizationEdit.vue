<template>
    <LoadingPage v-if="loading" />
    <ValidationObserver v-else ref="form" v-slot="{ handleSubmit }">
        <OrganizationHeader :title="organization.name">
            <div class="flex" v-if="organization && isCurrentUserNationalAdmin">
                <Button
                    v-if="dataChanged"
                    class="px-2"
                    variant="primaryText"
                    @click="cancelEdit"
                    >Annuler</Button
                >
                <Button
                    v-if="dataChanged"
                    @click="handleSubmit(submit)"
                    :loading="loading"
                    >Valider</Button
                >
            </div>
        </OrganizationHeader>
        <PrivateContainer class="py-8">
            <div v-if="error" class="text-error">
                {{ error }}
            </div>

            <div v-if="organization">
                <div class="grid grid-cols-3 grid-gap-32">
                    <div class="flex items-top mb-8 lg:mb-1">
                        <div class="mr-48">
                            <div>Territoire:</div>
                            <div class="text-lg">
                                {{ organization.locationName }}
                                <span v-if="organization.locationCode"
                                    >({{ organization.locationCode }})</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="flex items-top mb-8 lg:mb-1">
                        <div class="mr-48">
                            <div>Financement:</div>
                            <div class="text-lg">
                                <CheckableGroup
                                    v-model="being_funded_edited"
                                    direction="horizontal"
                                    rules="required"
                                    validationName="Financement"
                                >
                                    <Radio
                                        label="oui"
                                        v-model="being_funded_edited"
                                        :checkValue="true"
                                        type="checkbox"
                                    ></Radio>
                                    <Radio
                                        label="non"
                                        v-model="being_funded_edited"
                                        :checkValue="false"
                                        type="checkbox"
                                    ></Radio>
                                </CheckableGroup>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-top mb-8 lg:mb-1">
                        <div class="mr-48">
                            <div>Date de mise à jour:</div>
                            <div class="text-lg">
                                {{ beingFundedDate }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoadingError v-else-if="!organization">
                La structure demandée n'existe pas en base de données ou n'a pas
                d'utilisateurs actifs
            </LoadingError>
        </PrivateContainer>
    </ValidationObserver>
</template>
<script>
import { get as getConfig } from "#helpers/api/config";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import LoadingPage from "#app/components/PrivateLayout/LoadingPage";
import OrganizationHeader from "#app/pages/OrganizationDetails/ui/OrganizationHeader";
import { updateFundedStatus } from "#helpers/api/organization";
import { isCurrentUserNationalAdmin, formatDate } from "../utils/common.js";

export default {
    components: {
        PrivateContainer,
        LoadingError,
        OrganizationHeader,
        LoadingPage
    },
    data() {
        const { user } = getConfig();
        return {
            error: null,
            loading: false,
            currentUser: user,
            being_funded_edited: this.organization.being_funded,
            being_funded_before: this.organization.being_funded,
            being_funded_at_before: this.organization.being_funded_at
        };
    },
    props: {
        organization: {
            type: Object
        }
    },
    methods: {
        formatDate(d) {
            return formatDate(d);
        },
        async submit() {
            this.error = null;
            this.loading = true;

            try {
                const data = {
                    being_funded: this.being_funded_edited === true,
                    being_funded_at: new Date()
                };
                const organizationId = parseInt(this.$route.params.id, 10);
                const updatedOrganization = await updateFundedStatus(
                    organizationId,
                    data
                );
                this.$store.commit("updateOrganization", updatedOrganization);
                this.being_funded_before = updatedOrganization.being_funded;
                this.being_funded_edited = this.being_funded_before;
                this.being_funded_at_before =
                    updatedOrganization.being_funded_at;
            } catch ({ user_message, fields }) {
                this.loading = false;
                this.error = user_message;
            }
            this.loading = false;
        },
        cancelEdit() {
            this.error = null;
            this.loading = true;
            this.being_funded_edited = this.being_funded_before;
            this.loading = false;
        }
    },
    computed: {
        isCurrentUserNationalAdmin() {
            return isCurrentUserNationalAdmin(this.currentUser.role_id);
        },
        displayBeingFunded() {
            return this.isCurrentUserNationalAdmin() &&
                this.organization.being_funded
                ? true
                : false;
        },
        dataChanged() {
            return this.being_funded_edited !== this.being_funded_before;
        },
        beingFundedDate() {
            return this.dataChanged
                ? this.formatDate(new Date())
                : this.formatDate(this.organization.being_funded_at);
        }
    }
};
</script>
