<template>
    <aside
        :class="
            `text-xl w-10 h-10 leading-10 rounded-full text-white text-center bg-${color}`
        "
    >
        <Icon :icon="icon"></Icon>
    </aside>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            required: true
        },
        activity: {
            type: Object,
            required: true
        }
    },
    computed: {
        icon() {
            if (this.activity.entity === "shantytown") {
                if (this.activity.action === "update") {
                    return "pen";
                }

                return "map-marker-alt";
            }

            return "comment";
        }
    }
};
</script>
