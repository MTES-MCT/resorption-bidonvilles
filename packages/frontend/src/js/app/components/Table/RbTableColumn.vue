<template>
    <span>
        {{ column }}
    </span>
</template>
<script>
export default {
    name: "RbTableColumn",
    props: {
        column: String
    }
};
</script>
