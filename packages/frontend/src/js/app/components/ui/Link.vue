<template>
    <router-link v-if="internalLink" :to="to" :class="classes"
        ><slot></slot
    ></router-link>
    <a v-else :href="to" :class="classes"><slot></slot></a>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            classes: "text-primary hover:text-primaryDark"
        };
    },

    computed: {
        internalLink() {
            return this.to && this.to[0] === "/";
        }
    }
};
</script>
