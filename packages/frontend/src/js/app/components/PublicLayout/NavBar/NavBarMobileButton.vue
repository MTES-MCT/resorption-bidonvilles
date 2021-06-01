<template>
    <!-- Mobile Menu icon-->
    <button @click="onClick" class="focus:outline-none">
        <svg
            class="block h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    </button>
</template>

<script>
export default {
    props: {
        onClick: {
            type: Function,
            required: true
        }
    }
};
</script>
