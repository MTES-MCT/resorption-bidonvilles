<template>
    <div>
        <OrganizationHeader :title="organization.name">
            <div class="flex" v-if="isNationalAdmin">
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
            <div class="grid grid-cols-3 mb-8">
                <div>
                    <div>Territoire :</div>
                    <div class="text-lg">
                        {{ organization.locationName }}
                        <span v-if="organization.locationCode"
                            >({{ organization.locationCode }})</span
                        >
                    </div>
                </div>
                <div v-if="isNationalAdmin">
                    <div>Financement:</div>
                    <div class="text-lg">
                        {{ organization.being_funded ? "Oui" : "Non" }}
                    </div>
                </div>
                <div v-if="isNationalAdmin">
                    <div>Date de mise à jour:</div>
                    <div class="text-lg">
                        {{ beingFundedDate }}
                    </div>
                </div>
            </div>

            <OrganizationDetailsUser
                class="mb-4"
                v-for="user in organization.users"
                :user="user"
                :key="user.id"
            />
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
            isNationalAdmin: isCurrentUserNationalAdmin(user.role_id)
        };
    },
    props: {
        organization: {
            type: Object
        }
    },
    computed: {
        beingFundedDate() {
            return formatDate(this.organization.being_funded_at);
        }
    }
};
</script>
