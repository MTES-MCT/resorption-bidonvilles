<template>
    <div>
        <h1 class="font-bold text-xl">
            {{ title }} <MandatoryStar v-if="showMandatoryStar"></MandatoryStar>
        </h1>
        <p class="mt-1 mb-4"><slot /></p>
    </div>
</template>

<script>
module.exports = {
    props: {
        title: {
            required: true,
            type: String
        },
        showMandatoryStar: {
            required: false,
            type: Boolean,
            default: false
        }
    }
};
</script>
