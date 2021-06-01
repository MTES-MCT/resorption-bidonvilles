<template>
    <div>
        <div class="text-display-lg">
            {{ title }}
            <span class="text-secondary"
                ><font-awesome-icon v-if="icon" :icon="icon"
            /></span>
        </div>
        <div class="text-display-sm">{{ subtitle }}</div>
        <div class="text-sm">{{ info }}</div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: [String, Number],
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        info: {
            type: String,
            required: false
        },
        icon: {
            type: String,
            required: false
        }
    }
};
</script>
