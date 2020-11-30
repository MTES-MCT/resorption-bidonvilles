<template>
    <div class="flex items-center">
        <div class="mr-2">
            <Icon class="text-green" icon="check" v-if="value === true" />
            <Icon
                class="text-red"
                icon="times"
                v-if="value === false || value === null"
            />
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
    }
};
</script>
