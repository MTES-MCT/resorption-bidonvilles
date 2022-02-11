<template>
    <div class="border-b-2 border-gray-300 py-3">
        <router-link :to="target">
            <p class="no-underline text-display-sm text-black">
                {{ label }}
            </p>
        </router-link>
    </div>
</template>
<script>
export default {
    props: {
        target: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    }
};
</script>
