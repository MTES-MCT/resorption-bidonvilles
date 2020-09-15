<template>
    <div class="flex flex-row">
        <div>
            <font-awesome-icon :icon="icon" class="text-secondary text-3xl"></font-awesome-icon>
        </div>
        <div class="ml-2">
            <span class="text-xl">{{text}}</span>
            <span class="text-sm">{{info}}</span>
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
                type: String,
                required: true
            },
        }
    }
</script>
