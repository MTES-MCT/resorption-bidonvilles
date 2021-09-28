<template>
    <div class="flex flex-row">
        <div>
            <font-awesome-icon
                :icon="icon"
                size="2x"
                class="text-secondary"
            ></font-awesome-icon>
        </div>
        <div class="ml-2">
            <span class="font-bold text-display-md">{{ text }}</span>
            <span>{{ info }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "LandingPageBilanBlock",
    props: {
        icon: {
            required: true
        },
        text: {
            type: String,
            required: true
        },
        info: {
            type: String
        }
    }
};
</script>
