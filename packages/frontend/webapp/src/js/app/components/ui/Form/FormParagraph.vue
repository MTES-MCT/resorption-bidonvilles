<template>
    <div>
        <h1 :class="`font-bold text-${size}`">
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
        },
        size: {
            type: String,
            required: false,
            default: "xl"
        }
    }
};
</script>
