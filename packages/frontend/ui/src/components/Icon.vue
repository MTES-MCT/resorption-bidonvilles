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
        title: {
            type: String,
            required: false
        }
    },

    computed: {
        iconFull() {
            if (Array.isArray(this.icon)) {
                return this.icon.join(" ");
            }
            if (typeof this.icon === "string") {
                return this.icon.includes("fa-")
                    ? this.icon
                    : `fa-solid fa-${this.icon}`;
            }
            return "";
        },
        classes() {
            return this.iconFull + (this.spin ? " fa-spin" : "");
        }
    } 
};
</script>
