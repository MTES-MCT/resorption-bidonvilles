<template>
    <div
        :class="[
            active
                ? 'text-primary font-bold border-b-2 pb-1 border-primary'
                : 'cursor-pointer pb-1'
        ]"
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
