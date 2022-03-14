<template>
    <OrganizationDetailsUserWrapper :user="user" :linkToUser="linkToUser">
        <div
            :class="[
                'bg-G200 p-4 grid grid-cols-2 grid-gap-32',
                $store.getters['config/hasPermission']('user.read') &&
                    'hover:bg-blue200'
            ]"
        >
            <div>
                <h1 class="font-bold">
                    {{ user.last_name.toUpperCase() }} {{ user.first_name }}
                </h1>
                <div class="text-info">Fonction : {{ user.position }}</div>
                <div class="text-info">Rôle : {{ user.role }}</div>
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
import OrganizationDetailsUserIcon from "./OrganizationDetailsUserIcon";
import OrganizationDetailsUserWrapper from "./OrganizationDetailsUserWrapper";

export default {
    components: { OrganizationDetailsUserWrapper, OrganizationDetailsUserIcon },
    props: {
        user: {
            type: Object
        },
        linkToUser: {
            // true pour rediriger vers la fiche utilisateur, false pour rediriger vers la fiche structure
            type: Boolean,
            default: true
        }
    }
};
</script>
