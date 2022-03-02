<template>
    <router-link :to="target">
        <p :class="classes">
            {{ label }}
        </p>
    </router-link>
</template>
<script>
export default {
    props: {
        target: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        group: {
            type: String,
            required: false
        },
        classes: {
            type: String,
            required: false
        }
    },
    methods: {
        isCurrentRouteAMemberOf(group) {
            return this.$route.matched.some(
                route => route.meta.group === group
            );
        }
    }
};
</script>
