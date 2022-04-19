<template>
    <div class="bg-yellow-200 px-4 flex items-center justify-between">
        <div class="flex items-center">
            <div
                v-if="icon"
                class="rounded-full bg-yellow-400 w-6 h-6 text-center text-xs leading-6"
            >
                <Icon :icon="icon"></Icon>
            </div>
            <slot name="body" />
        </div>
        <div>
            <slot name="button">
                <Button @click="click">{{ buttonLabel }}</Button>
            </slot>
            <span v-if="closable" class="ml-2" @click="close"
                ><Icon icon="times" class="cursor-pointer"></Icon
            ></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // required only if the slot "button" is not overridden
        buttonLabel: {
            type: String,
            required: false
        },
        icon: {
            type: String,
            required: false
        },
        closable: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    methods: {
        click() {
            this.$emit("click");
        },
        close() {
            this.$emit("close");
        }
    }
};
</script>
