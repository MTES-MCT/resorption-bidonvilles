<template>
    <div class="inline-block border h-20 border-1 border-blue300 px-4 mr-4">
        <p class="font-bold">
            {{ town.addressSimple }}
        </p>
        {{ town.city.name }}
    </div>
</template>

<script>
export default {
    props: {
        town: {
            type: Object,
        },
    },
};
</script>
