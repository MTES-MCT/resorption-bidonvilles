<template>
    <label v-if="label" class="font-bold" :class="[info && inlineInfo ? 'inline' : '', error ? '!text-error' : '']" :for="for">{{ label }}
        <MandatoryStar class="ml-1" v-if=" showMandatoryStar " />
    </label>
    <p v-if=" info " class="mb-3 text-G700" :class=" inlineInfo ? 'inline' : '' ">{{ info }}
        <MandatoryStar class="ml-1" v-if=" (showMandatoryStar && !label) " />
    </p>
</template>

<script>
import MandatoryStar from "./MandatoryStar.vue";

export default {
    props: {
        for: {
            type: String,
        },
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
        },
        error: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        MandatoryStar,
    }
};
</script>
