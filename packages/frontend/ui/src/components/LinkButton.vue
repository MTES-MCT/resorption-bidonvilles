<template>
    <span class="hover:bg-G100 p-3 text-primary" :class="!to ? 'inline-block cursor-pointer' : ''">
        <Icon v-if="icon" :icon="icon" class="mr-2 w-4" />
        <router-link v-if="internalLink" :to="to">
            <slot></slot>
        </router-link>
        <a v-else-if="to" :href="to">
            <slot></slot>
            <Icon v-if="!toRB && !isMailto" icon="arrow-up-right-from-square" class="text-xs text-blue300 ml-1" />
        </a>
        <span v-else>
            <slot />
        </span>
    </span>
</template>

<script>
import Icon from "./Icon.vue";

export default {
    name: "LinkButton",

    components: {
        Icon
    },

    props: {
        to: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false,
            default: null
        }
    },

    computed: {
        toRB() {
            return /(\/\/|\.)resorption-bidonvilles\./.test(this.to) === true;
        },
        internalLink() {
            return this.to && this.to[0] === "/";
        },
        isMailto() {
            return this.to.startsWith("mailto:");
        }
    }
};
</script>
