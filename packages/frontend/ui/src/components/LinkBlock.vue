<template>
    <router-link v-if="internalLink" :to="to" :class="`block hover:bg-G100 p-3 ${textColor}`">
        <span v-bind:class="active ? 'border-l-3 border-l-primary pl-2' : ''">
            <Icon v-if="icon" :icon="icon" class="mr-2" />
            <slot />
        </span>
    </router-link>

    <a v-else :href="to" :class="`block hover:bg-G100 p-3 ${textColor}`">
        <span v-bind:class="active ? 'border-l-3 border-l-primary pl-2' : ''">
            <Icon v-if="icon" :icon="icon" class="mr-2" />
            <slot />
        </span>
    </a>
</template>

<script>
import Icon from "./Icon.vue";

export default {
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
        },
        variant: {
            type: String,
            required: false,
            default: 'primary', // either 'black' or 'primary'
        },
        active: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        textColor() {
            if (this.variant === 'black') {
                return this.active ? 'text-primary' : 'text-black';
            }

            return 'text-primary';
        },
        internalLink() {
            return this.to && this.to[0] === "/";
        }
    }
}
</script>