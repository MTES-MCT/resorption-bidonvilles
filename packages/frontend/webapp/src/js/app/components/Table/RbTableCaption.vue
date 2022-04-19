<template>
    <span class="font-bold text-xl">
        {{ caption }}
    </span>
</template>
<script>
export default {
    props: {
        caption: {
            type: String,
            required: true
        }
    }
};
</script>
