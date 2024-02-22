<template>
    <p>
        <button v-if="!to" :class="`${withStyle ? linkClasses : 'cursor-pointer'} ${focusClasses}`">
            <span class="border-b border-b-G600 hover:border-b-2 hover:border-b-primary">
            <slot />
            </span>
        </button>
        <template v-else>
            <Icon icon="arrow-up-right-from-square" v-if="!internalLink && !toRB && !isMailto"
                :class="`mr-1 ${linkClasses}`" />
            <router-link v-if="internalLink" :to="to" :class="`${linkClasses} ${focusClasses}`" :aria-label="ariaLabel">
                <slot />
            </router-link>
            <a v-else :href="to" :class="`${linkClasses} ${focusClasses}`" :aria-label="ariaLabel">
                <slot />
            </a>
        </template>
    </p>
</template>

<script>
import Icon from "./Icon.vue";
import focusClasses from '../../../common/utils/focus_classes';

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
        ariaLabel: {
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
        },
        withStyle: {
            // pour les liens sans prop "to" on n'intègre pas les styles par défaut (ce qui donne un lien noir)
            // en passant "withStyle" à true, on intègre les styles malgré tout
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            linkClasses: `${this.color} hover:${this.hoverColor} ${this.classes} cursor-pointer`,
            focusClasses: focusClasses.ring,
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
