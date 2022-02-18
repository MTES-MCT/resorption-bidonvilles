<template>
    <div
        :class="[
            'w-12 h-12 items-center flex flex-col justify-center rounded-full border cursor-pointer border-primary text-primary hover:bg-blue100',
            additionalClasses
        ]"
    >
        <Icon :icon="icon" />
    </div>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        additionalClasses() {
            if (this.disabled) {
                return "opacity-50 cursor-not-allowed";
            }

            return "";
        }
    }
};
</script>
