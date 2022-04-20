<template>
    <div>
        <div>
            <Icon :icon="icon" />
        </div>
        <div class="font-bold">
            {{ title }}
        </div>
        <div>
            {{ description }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
};
</script>
