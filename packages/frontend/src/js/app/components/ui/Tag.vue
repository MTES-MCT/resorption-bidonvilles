<template>
    <div :class="[display, variantClasses]">
        <slot />
        <span class="ml-2 cursor-pointer" @click="onDelete" v-if="onDelete">
            <Icon icon="times" />
        </span>
    </div>
</template>

<script>
export default {
    props: {
        onDelete: {
            type: Function
        },
        variant: {
            type: String,
            default: "default"
        },
        display: {
            type: String,
            default: "inline-flex"
        },
        uppercase: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        variantClasses() {
            return {
                default: "px-4 py-1 flex-row items-center bg-blue200 text-sm",
                withoutBackground: "px-3 mr-2 mb-2 text-sm",
                primary:
                    "bg-blue100 text-primary px-3 mr-2 mb-2 rounded-lg text-sm",
                highlight: `bg-yellow-200 py-1 px-3 ${
                    this.uppercase ? "uppercase" : ""
                } text-xs text-primary text-sm`,
                date: `bg-blue100 text-primary ${
                    this.uppercase ? "uppercase" : ""
                } px-2 py-1 text-sm`,
                pin: `px-2 py-1 bg-blue100 text-primary ${
                    this.uppercase ? "uppercase" : ""
                } text-xs`,
                pin_red: `px-2 py-1 bg-red200 text-red600 ${
                    this.uppercase ? "uppercase" : ""
                } text-xs`,
                info: "bg-blue100 text-primary px-2 py-1 text-xs"
            }[this.variant];
        }
    }
};
</script>
