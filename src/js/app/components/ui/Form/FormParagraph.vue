<template>
    <div>
        <h1 class="font-bold text-xl">{{ title }}</h1>
        <p class="my-4"><slot /></p>
    </div>
</template>

<script>
module.exports = {
    props: {
        title: {
            required: true,
            type: String
        }
    }
};
</script>
