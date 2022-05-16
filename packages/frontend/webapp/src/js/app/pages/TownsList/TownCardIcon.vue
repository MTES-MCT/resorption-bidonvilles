<template>
    <div class="flex items-center">
        <span
            :class="[
                'flex rounded-full text-xs border-2 mr-3 mb-1 h-6 w-6 items-center justify-center',
                colorClass
            ]"
            style="padding: 0.2em"
            ><Icon :icon="icon"
        /></span>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        status: {
            type: String,
            validator: value =>
                ["unknown", "bad", "toImprove", "good"].includes(value)
        }
    },
    computed: {
        colorClass() {
            const colors = {
                good: "text-green500 border-green500",
                toImprove: "text-secondary border-secondary",
                bad: "text-red border-red",
                unknown: "text-red border-red"
            };

            return colors[this.status] || "text-red border-red";
        },
        icon() {
            const icons = {
                good: "check",
                toImprove: "exclamation-triangle",
                bad: "times",
                unknown: "question"
            };

            return icons[this.status] || "question";
        }
    }
};
</script>
