<template>
    <div class="relative">
        <slot />
        <div class="absolute bottom-0 right-0 mr-4 text-white">
            {{ credit }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        credit: {
            type: String
        }
    }
};
</script>
