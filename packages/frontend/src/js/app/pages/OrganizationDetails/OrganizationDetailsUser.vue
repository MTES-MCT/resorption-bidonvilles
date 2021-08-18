<template>
    <OrganizationDetailsUserWrapper :user="user">
        <div
            :class="[
                'bg-G100 border-l-4 border-info p-4 grid grid-cols-2 grid-gap-32',
                hasPermission('user.read') && 'hover:bg-blue200'
            ]"
        >
            <div>
                <h1 class="text-display-sm">
                    {{ user.last_name.toUpperCase() }} {{ user.first_name }}
                </h1>
                <div class="text-info">Fonction : {{ user.position }}</div>
            </div>
            <div>
                <OrganizationDetailsUserIcon icon="envelope">{{
                    user.email
                }}</OrganizationDetailsUserIcon>
                <OrganizationDetailsUserIcon v-if="user.phone" icon="phone">{{
                    user.phone
                }}</OrganizationDetailsUserIcon>
            </div>
        </div>
    </OrganizationDetailsUserWrapper>
</template>
<script>
import OrganizationDetailsUserIcon from "#app/pages/OrganizationDetails/OrganizationDetailsUserIcon";
import OrganizationDetailsUserWrapper from "#app/pages/OrganizationDetails/OrganizationDetailsUserWrapper";
import { hasPermission } from "#helpers/api/config";

export default {
    components: { OrganizationDetailsUserWrapper, OrganizationDetailsUserIcon },
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        hasPermission
    }
};
</script>
