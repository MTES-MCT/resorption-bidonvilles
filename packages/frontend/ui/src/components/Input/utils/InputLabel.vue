<template>
    <div v-if="label" class="font-bold" :class="info && inlineInfo ? 'inline' : ''">{{ label }}
        <MandatoryStar class="ml-1" v-if="showMandatoryStar" />
    </div>
    <div v-if="info" class="mb-3 text-G600" :class="inlineInfo ? 'inline' : ''">{{ info }}
        <MandatoryStar class="ml-1" v-if="(showMandatoryStar && !label)" />
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
        inlineInfo: {
            type: Boolean,
            required: false,
            default: false,
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
