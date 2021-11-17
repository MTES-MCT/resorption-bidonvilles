<template>
    <div>
        <OrganizationHeader :title="organization.name">
            <div class="flex" v-if="organization && isCurrentUserNationalAdmin">
                <Button
                    variant="primary"
                    @click="$emit('openEdit')"
                    icon="pen"
                    iconPosition="left"
                    >Mettre à jour</Button
                >
            </div>
        </OrganizationHeader>

        <PrivateContainer class="py-8">
            <div v-if="organization">
                <div class="grid grid-cols-3 grid-gap-32">
                    <div class="flex items-top mb-8">
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
                    <div
                        v-if="isCurrentUserNationalAdmin"
                        class="flex items-top mb-8"
                    >
                        <div class="mr-48">
                            <div>Financement:</div>
                            <div class="text-lg">
                                <span>
                                    {{
                                        organization.being_funded
                                            ? "Oui"
                                            : "Non"
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="isCurrentUserNationalAdmin"
                        class="flex items-top mb-8"
                    >
                        <div class="mr-48">
                            <div>Date de mise à jour:</div>
                            <div class="text-lg">
                                {{ beingFundedDate }}
                            </div>
                        </div>
                    </div>
                </div>

                <OrganizationDetailsUser
                    class="mb-4"
                    v-for="user in organization.users"
                    :user="user"
                    :key="user.id"
                />
            </div>
            <LoadingError v-else-if="!organization">
                La structure demandée n'existe pas en base de données ou n'a pas
                d'utilisateurs actifs
            </LoadingError>
        </PrivateContainer>
    </div>
</template>
<script>
import { get as getConfig } from "#helpers/api/config";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import LoadingError from "#app/components/PrivateLayout/LoadingError";
import OrganizationDetailsUser from "#app/pages/OrganizationDetails/OrganizationUser/OrganizationDetailsUser";
import OrganizationHeader from "#app/pages/OrganizationDetails/ui/OrganizationHeader";
import { isCurrentUserNationalAdmin, formatDate } from "../utils/common.js";

export default {
    components: {
        OrganizationDetailsUser,
        PrivateContainer,
        LoadingError,
        OrganizationHeader
    },
    data() {
        const { user } = getConfig();
        return {
            currentUser: user,
            isHover: false
        };
    },
    props: {
        organization: {
            type: Object
        },
        directoryLoading: {
            type: Boolean
        }
    },
    methods: {
        formatDate(d) {
            return formatDate(d);
        }
    },
    computed: {
        beingFundedDate() {
            return formatDate(this.organization.being_funded_at);
        },
        isCurrentUserNationalAdmin() {
            return isCurrentUserNationalAdmin(this.currentUser.role_id);
        }
    }
};
</script>
