<template>
    <li
        :class="
            `inline-block align-middle pl-4 cursor-pointer
            ${
                active
                    ? 'font-bold text-primary'
                    : 'underline hover:no-underline'
            }`
        "
    >
        <slot />
    </li>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            required: true
        }
    }
};
</script>
