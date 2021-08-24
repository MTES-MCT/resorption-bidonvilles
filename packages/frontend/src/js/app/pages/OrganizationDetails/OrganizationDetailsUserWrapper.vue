<template>
    <div>
        <router-link
            :to="'/nouvel-utilisateur/' + user.id"
            v-if="hasPermission('user.read')"
        >
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
        }
    },
    methods: {
        hasPermission
    }
};
</script>
