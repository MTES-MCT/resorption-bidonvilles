<template>
    <ValidationObserver v-slot="{ handleSubmit }">
        <OrganizationHeader :title="organization.name">
            <div class="flex">
                <Button
                    class="px-2"
                    variant="primaryText"
                    @click="cancelEdit"
                    :loading="loading"
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

            <div class="grid grid-cols-3 mb-8">
                <div>
                    <div>Territoire:</div>
                    <div class="text-lg">
                        {{ organization.locationName }}
                        <span v-if="organization.locationCode"
                            >({{ organization.locationCode }})</span
                        >
                    </div>
                </div>
                <div>
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
        </PrivateContainer>
    </ValidationObserver>
</template>

<script>
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import OrganizationHeader from "#app/pages/OrganizationDetails/ui/OrganizationHeader";
import { updateBeingFunded } from "#helpers/api/organization";

export default {
    components: {
        PrivateContainer,
        OrganizationHeader
    },
    data() {
        return {
            error: null,
            loading: false,
            edit: {
                being_funded: this.organization.being_funded || false
            }
        };
    },
    props: {
        organization: {
            type: Object
        }
    },
    methods: {
        async submit() {
            if (this.loading === true) {
                return;
            }

            this.error = null;
            this.loading = true;

            try {
                const partialData = await updateBeingFunded(
                    this.organization.id,
                    this.edit
                );

                this.$store.commit("updateOrganization", {
                    id: this.organization.id,
                    partial: partialData
                });
                this.$emit("cancelEdit");
            } catch (error) {
                this.error =
                    (error && error.user_message) ||
                    "Une erreur inconnue est survenue";
            }

            this.loading = false;
        },
        cancelEdit() {
            if (this.loading === true) {
                return;
            }

            this.$emit("cancelEdit");
        }
    },
    computed: {
        dataChanged() {
            return this.edit.being_funded !== this.organization.being_funded;
        }
    }
};
</script>
