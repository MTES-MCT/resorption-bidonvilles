<template>
    <span class="border-b border-b-G400 hover:border-b-2 hover:border-b-primary">
        <span class="cursor-pointer" v-if="!to">
            <slot />
        </span>
        <template v-else>
            <Icon icon="arrow-up-right-from-square" v-if="!internalLink && !toRB && !isMailto"
                :class="`mr-1 ${linkClasses}`" />
            <router-link v-if="internalLink" :to="to" :class="linkClasses">
                <slot />
            </router-link>
            <a v-else :href="to" :class="linkClasses">
                <slot />
            </a>
        </template>
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
            required: false
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
        toRB() {
            return this.to && /(\/\/|\.)resorption-bidonvilles\./.test(this.to) === true;
        },
        internalLink() {
            return this.to && ["/", "#"].includes(this.to[0]);
        },
        isMailto() {
            return this.to && this.to.startsWith("mailto:");
        }
    }
};
</script>
