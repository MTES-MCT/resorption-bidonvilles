<template>
    <div>
        <div
            class="rounded-full inline-block bg-yellow-400 w-6 h-6 text-center text-size-xs align-middle leading-6"
        >
            <Icon :icon="icon"></Icon>
        </div>
        <span class="ml-2 font-bold"><slot name="title"/></span>
        <span class="ml-2" @click="toggle"
            ><Icon :icon="togglerIcon" class="cursor-pointer"></Icon
        ></span>
        <transition name="toggle" mode="out-in">
            <div class="bg-yellow-200 p-6 mt-2" v-if="visible">
                <slot name="content" />
            </div>
        </transition>
    </div>
</template>

<style scoped>
.toggle-enter-active,
.toggle-leave-active {
    transition: all 0.3s;
    max-height: 500px;
}

.toggle-enter,
.toggle-leave-to {
    opacity: 0;
    max-height: 0px;
}
</style>

<script>
export default {
    props: {
        icon: {
            type: String,
            default: "info-circle"
        }
    },

    data() {
        return {
            visible: true
        };
    },

    computed: {
        togglerIcon() {
            if (this.visible === true) {
                return "chevron-up";
            }

            return "chevron-down";
        }
    },

    methods: {
        toggle() {
            this.visible = !this.visible;
        }
    }
};
</script>
