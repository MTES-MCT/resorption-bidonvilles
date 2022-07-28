<template>
    <div :class="withoutBorder ? '' : 'border-b-1 border-color-G600'">
        <div
            :class="[
                'flex flex-row items-center  py-1',
                spaceBetween ? 'justify-between' : ''
            ]"
        >
            <div :class="['max-w-2xl', !spaceBetween && 'mr-4']">
                {{ label }}
            </div>
            <div class="flex-shrink-0 ml-2">
                <slot />
            </div>
        </div>
        <span v-if="info" class="text-G500">{{ info }}</span>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String
        },
        info: {
            type: String,
            required: false
        },
        spaceBetween: {
            type: Boolean,
            default: true
        },
        withoutBorder: {
            type: Boolean,
            default: false
        }
    }
};
</script>
