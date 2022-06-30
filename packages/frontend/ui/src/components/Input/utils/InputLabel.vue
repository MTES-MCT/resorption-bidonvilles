<template>
    <div>
        <div v-if="label" class="font-bold">
            {{ label }} <MandatoryStar v-if="showMandatoryStar"></MandatoryStar>
        </div>
        <div v-if="info" class="mb-3 text-G600">{{ info }}</div>
    </div>
</template>

<script>
import MandatoryStar from "./MandatoryStar.vue";

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
    },
    components: {
        MandatoryStar,
    }
};
</script>
