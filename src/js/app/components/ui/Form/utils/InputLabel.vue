<template>
    <div>
        <div v-if="label" class="font-bold">
            {{ label }} <MandatoryStar v-if="showMandatoryStar"></MandatoryStar>
        </div>
        <div v-if="info" class="mb-3 italic text-G600">{{ info }}</div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        },
        info: {
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
