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
                                    v-model="edit.being_funded"
                                    direction="horizontal"
                                    rules="required"
                                    validationName="Financement"
                                >
                                    <Radio
                                        label="oui"
                                        v-model="edit.being_funded"
                                        :checkValue="true"
                                        type="checkbox"
                                    ></Radio>
                                    <Radio
                                        label="non"
                                        v-model="edit.being_funded"
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
        </PrivateContainer>
    </ValidationObserver>
</template>
<script>
import { get as getConfig } from "#helpers/api/config";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import LoadingPage from "#app/components/PrivateLayout/LoadingPage";
import OrganizationHeader from "#app/pages/OrganizationDetails/ui/OrganizationHeader";
import { updateBeingFunded } from "#helpers/api/organization";
import { formatDate, isCurrentUserNationalAdmin } from "../utils";

export default {
    components: {
        PrivateContainer,
        OrganizationHeader,
        LoadingPage
    },
    data() {
        const { user } = getConfig();
        return {
            error: null,
            loading: false,
            currentUser: user,
            being_funded_before: this.organization.being_funded,
            being_funded_at_before: this.organization.being_funded_at,
            edit: {
                being_funded: this.organization.being_funded || false,
                being_funded_at: this.organization.being_funded_at || ""
            }
        };
    },
    props: {
        organization: {
            type: Object
        }
    },
    methods: {
        formatDate,
        async submit() {
            this.error = null;
            this.loading = true;

            try {
                this.edit.being_funded_at = new Date();
                const organizationId = parseInt(this.$route.params.id, 10);
                const updatedOrganization = await updateBeingFunded(
                    organizationId,
                    this.edit
                );
                updatedOrganization.orgData.id = organizationId;

                // Reload organizations to update it in the vuex store
                const updatedDirectory = this.$store.getters.directory;
                const index = updatedDirectory.findIndex(item => {
                    return item.id === updatedOrganization.orgData.id;
                });
                if (index >= 0) {
                    // updatedDirectory[index] = {
                    //     ...updatedDirectory[index],
                    //     ...updatedOrganization.orgData
                    // };

                    updatedDirectory[index].being_funded =
                        updatedOrganization.orgData.being_funded;
                    updatedDirectory[index].being_funded_at =
                        updatedOrganization.orgData.being_funded_at;
                }
                this.$store.commit("setDirectory", updatedDirectory);
                this.being_funded_before =
                    updatedOrganization.orgData.being_funded;
                this.being_funded_at_before =
                    updatedOrganization.orgData.being_funded_at;
            } catch ({ user_message, fields }) {
                this.loading = false;
                this.error = user_message;
            }
            this.loading = false;
        },
        cancelEdit() {
            this.error = null;
            this.loading = true;
            this.edit.being_funded = this.being_funded_before;
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
            return (
                this.edit.being_funded !== null &&
                this.edit.being_funded !== this.being_funded_before
            );
        },
        beingFundedDate() {
            return this.dataChanged
                ? this.formatDate(new Date())
                : this.formatDate(this.edit.being_funded_at);
        }
    }
};
</script>
