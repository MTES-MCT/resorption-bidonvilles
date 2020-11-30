<template>
    <!-- Component used by Radio / Checkbox with card variant -->
    <label
        :class="[
            'inline-flex cursor-pointer border-2 rounded-md border-primary px-4 py-3 hover:bg-primary hover:text-white',
            isChecked ? 'bg-primary text-white' : 'text-primary'
        ]"
    >
        <slot />
    </label>
</template>

<script>
export default {
    props: {
        isChecked: {
            type: Boolean
        }
    }
};
</script>
