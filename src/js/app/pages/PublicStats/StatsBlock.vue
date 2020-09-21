<template>
    <div>
        <div class="text-display-lg">{{title}} <span class="text-secondary"><font-awesome-icon :icon="icon"/></span> </div>
        <div class="text-display-sm">{{subtitle}}</div>
        <div class="text-sm">{{info}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            },
            subtitle: {
                type: String,
                required: true
            },
            info: {
                required: true
            },
            icon: {
                required: true
            }
        }
    }
</script>
