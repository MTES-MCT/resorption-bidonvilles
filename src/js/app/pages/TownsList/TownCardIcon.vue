<template>
    <div :class="['flex items-center', color]">
        <div class="mr-2 w-4">
            <Icon icon="check" v-if="value === true" />
            <Icon icon="times" v-if="value === false || value === null" />
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        value: {
            validator: prop => typeof prop === "boolean" || prop === null
        }
    },
    computed: {
        color() {
            if (this.value === true) {
                return "text-green";
            }

            return "text-red";
        }
    }
};
</script>
