<template>
    <div class="flex items-center">
        <div class="mr-2">
            {{ population }}
        </div>
        <div>
            <Icon icon="male" />{{ " " }}
            <span v-if="population >= 25"> <Icon icon="male" />{{ " " }}</span>
            <span v-if="population >= 75"> <Icon icon="male" />{{ " " }}</span>
            <span v-if="population >= 100"> <Icon icon="male"/></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        population: {
            type: Number,
            required: true
        }
    }
};
</script>
