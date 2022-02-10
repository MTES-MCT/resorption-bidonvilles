<template>
    <div
        :class="[
            'border-b-2 pb-1 inline-block',
            active
                ? 'text-primary font-bold border-primary'
                : 'cursor-pointer border-transparent'
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
