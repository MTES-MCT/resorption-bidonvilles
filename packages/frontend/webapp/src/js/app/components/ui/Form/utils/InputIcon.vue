<template>
    <div
        :class="[
            'absolute inset-y-0 flex items-center',
            positionClasses,
            disabledClasses
        ]"
        @click="onClick"
    >
        <slot>
            <Icon v-if="icon" :icon="icon" />
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        icon: {
            type: String
        },
        position: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        positionClasses() {
            if (this.position === "after") {
                return "right-0 pr-3 ";
            }

            return "left-0 pl-3 ";
        },
        disabledClasses() {
            if (this.disabled) {
                return "cursor-not-allowed opacity-25";
            }

            return "";
        }
    },
    methods: {
        onClick(event) {
            if (this.disabled) {
                event.stopPropagation();
            }
        }
    }
};
</script>
