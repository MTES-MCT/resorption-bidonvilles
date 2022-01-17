<template>
    <span class="font-bold" style="font-size: 1.375rem;">
        {{ caption }}
    </span>
</template>
<script>
export default {
    name: "RbTableCaption",
    props: {
        caption: String
    }
};
</script>
