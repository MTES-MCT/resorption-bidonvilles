<template>
    <div
        :class="[
            'border-b-2 pb-1 inline-block mr-8',
            active
                ? 'text-primary font-bold border-primary'
                : 'cursor-pointer border-transparent'
        ]"
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
