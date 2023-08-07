<template>
    <button :class="[
        'border-b-2 pb-1 inline-block mr-8 focus:outline-none focus:ring-2 ring-offset-2 ring-info',
        active
            ? 'text-primary font-bold border-primary'
            : 'cursor-pointer border-transparent'
    ]">
        <slot />
    </button>
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
