<template>
    <div>
        <font-awesome-icon :icon="icon" size="3x"></font-awesome-icon>
        <div class="text-xl mt-2"><slot/></div>
    </div>
</template>

<script>
    export default {
        name: "LandingPageFeatureBlock",
        props: {
            icon: {
                type: String,
                required: true
            },
        }
    }
</script>
