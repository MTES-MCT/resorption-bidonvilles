<template>
    <div :class="['inline-flex text-sm', variantClasses]">
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
        }
    },
    computed: {
        variantClasses() {
            return {
                default: "px-4 py-1 flex-row items-center bg-blue200",
                withoutBackground: "px-3 mr-2 mb-2",
                primary: "bg-blue100 text-primary px-3 mr-2 mb-2 rounded-lg",
                date: "bg-blue100 text-primary uppercase px-2 py-1"
            }[this.variant];
        }
    }
};
</script>
