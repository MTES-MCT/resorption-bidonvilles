<template>
    <span>
        <Icon icon="external-link-alt" v-if="!internalLink" :class="`mr-1 ${linkClasses}`" />
        <router-link v-if="internalLink" :to="to" :class="linkClasses"
            ><slot></slot
        ></router-link>
        <a v-else :href="to" :class="linkClasses"><slot></slot></a>
    </span>
</template>

<script>
import Icon from "./Icon.vue";

export default {
    name: "Link",

    components: {
        Icon
    },

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
            default: "text-primary"
        },
        hoverColor: {
            type: String,
            required: false,
            default: "text-primaryDark"
        }
    },

    data() {
        return {
            linkClasses: `${this.color} hover:${this.hoverColor} ${this.classes} cursor-pointer`
        };
    },

    computed: {
        internalLink() {
            return this.to && this.to[0] === "/";
        }
    }
};
</script>
