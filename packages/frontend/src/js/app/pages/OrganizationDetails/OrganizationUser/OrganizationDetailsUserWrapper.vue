<template>
    <div>
        <router-link :to="to" v-if="hasLinkPermission">
            <slot />
        </router-link>
        <div v-else>
            <slot />
        </div>
    </div>
</template>

<script>
import { hasPermission } from "#helpers/api/config";

export default {
    props: {
        user: {
            type: Object
        },
        linkToUser: {
            // true pour rediriger vers la fiche utilisateur, false pour rediriger vers la fiche structure
            type: Boolean,
            default: true
        }
    },
    methods: {
        hasPermission
    },
    computed: {
        hasLinkPermission() {
            if (this.linkToUser !== true) {
                return true;
            }

            return hasPermission("user.read");
        },
        to() {
            if (this.linkToUser === true) {
                return "/nouvel-utilisateur/" + this.user.id;
            }

            return "/annuaire/" + this.user.organization.id;
        }
    }
};
</script>
