<template>
    <div
        :class="[active ? 'text-primary underline' : 'cursor-pointer']"
        v-on="$listeners"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean
        }
    }
};
</script>
