<template>
    <span class="hover:bg-G100 p-3 text-primary" :class="!to ? 'inline-block cursor-pointer' : ''">
        <Icon v-if="icon" :icon="icon" class="mr-2 w-4" />
        <router-link v-if="internalLink" :to="to" :class="focusClasses">
            <slot />
        </router-link>
        <a v-else-if="to" :href="to" :target="!toRB && !isMailto ? '_blank' : ''" :class="focusClasses">
            <slot />
        </a>
        <span v-else>
            <slot />
        </span>
    </span>
</template>

<script>
import Icon from "./Icon.vue";
import focusClasses from '../../../common/utils/focus_classes';

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

    data() {
        return {
            focusClasses: focusClasses.ring,
        };
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
