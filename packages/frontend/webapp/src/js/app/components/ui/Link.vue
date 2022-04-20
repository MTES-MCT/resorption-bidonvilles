<template>
    <router-link v-if="internalLink" :to="to" :class="linkClasses"
        ><slot></slot
    ></router-link>
    <a v-else :href="to" :class="linkClasses"><slot></slot></a>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        },
        classes: {
            type: String,
            required: false,
            default: ""
        },
        color: {
            type: String,
            required: false,
            default: "primary"
        },
        hoverColor: {
            type: String,
            required: false,
            default: "primaryDark"
        }
    },

    data() {
        return {
            linkClasses: `text-${this.color} hover:text-${this.hoverColor} ${this.classes}`
        };
    },

    computed: {
        internalLink() {
            return this.to && this.to[0] === "/";
        }
    }
};
</script>
