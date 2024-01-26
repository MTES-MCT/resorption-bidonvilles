<template>
    <span class="inline-block">
        <i :class="classes" :title="title" :aria-hidden="ariaHidden || !!title"></i>
        <span v-if="!!title" class="sr-only"> {{ title }}</span>
    </span>
    
</template>

<script>
export default {
    name: "RbIcon",

    props: {
        icon: {
            type: [String, Array],
            required: true
        },
        spin: {
            type: Boolean
        },
        title: {
            type: String,
            required: false
        },
        ariaHidden: {
            type: Boolean,
            required: false,
            default: undefined,
        },
    },

    computed: {
        iconFull() {
            return this.icon.includes("fa-") ? this.icon : `fa-solid fa-${this.icon}`;
        },
        classes() {
            return this.iconFull + (this.spin ? " fa-spin" : "");
        }
    } 
};
</script>
