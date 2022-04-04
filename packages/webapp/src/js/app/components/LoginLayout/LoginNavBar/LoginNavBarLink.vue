<template>
    <component
        :is="as"
        :class="[
            'uppercase',
            'hover:text-primary',
            isActive ? 'text-primary' : 'text-G600'
        ]"
        :to="to"
        :href="href"
        ><slot
    /></component>
</template>

<script>
export default {
    props: {
        to: {
            type: String
        },
        href: {
            type: String
        },
        as: {
            type: String,
            default: "router-link"
        }
    },
    computed: {
        isActive() {
            return this.$route.path === this.to;
        }
    }
};
</script>
