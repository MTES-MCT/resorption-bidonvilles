<template>
    <div :class="['absolute inset-y-0 flex items-center', positionClasses]">
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
        }
    },
    computed: {
        positionClasses() {
            if (this.position === "after") {
                return "right-0 pr-3 ";
            }

            return "left-0 pl-3 ";
        }
    }
};
</script>
