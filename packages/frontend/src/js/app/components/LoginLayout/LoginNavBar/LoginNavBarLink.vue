<template>
    <component
        :is="is"
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
            type: String,
        },
        href: {
            type: String,
        },
        is: {
            type: String,
            default: "router-link"
        }
    },
    computed: {
        isActive() {
            console.log(this.$route.path);
            console.log(this.to);
            return this.$route.path === this.to;
        }
    }
};
</script>
