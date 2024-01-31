<template>
    <span class="inline-block">
        <i :class="classes" :title="title" aria-hidden="true"></i>
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
