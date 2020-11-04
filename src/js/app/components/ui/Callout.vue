<template>
    <div class="bg-G200 py-8 px-8 border-l-4 border-primary">
        <div class="text-display-md mb-4">{{ title }}</div>
        <div><slot /></div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }
    }
};
</script>
