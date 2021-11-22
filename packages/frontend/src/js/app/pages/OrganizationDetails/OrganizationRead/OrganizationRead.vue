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
                                {{ organization.being_funded_at }}
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
        </PrivateContainer>
    </div>
</template>
<script>
import { get as getConfig } from "#helpers/api/config";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import OrganizationDetailsUser from "#app/pages/OrganizationDetails/OrganizationUser/OrganizationDetailsUser";
import OrganizationHeader from "#app/pages/OrganizationDetails/ui/OrganizationHeader";
import { formatDate, isCurrentUserNationalAdmin } from "../utils";

export default {
    components: {
        OrganizationDetailsUser,
        PrivateContainer,
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
        formatDate
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
