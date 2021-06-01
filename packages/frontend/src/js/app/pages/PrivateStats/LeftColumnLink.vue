<template>
    <router-link :to="to" :class="isActive ? 'text-primary' : ''"
        ><slot />
    </router-link>
</template>

<script>
export default {
    props: {
        to: {
            type: String
        }
    },
    computed: {
        isActive() {
            return this.$route.path === this.to;
        }
    }
};
</script>
