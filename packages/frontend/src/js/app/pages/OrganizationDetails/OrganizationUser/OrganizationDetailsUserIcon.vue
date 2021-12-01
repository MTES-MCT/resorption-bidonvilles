<template>
    <div class="flex items-center">
        <Icon :icon="icon" class="text-G400" />
        <div class="ml-2"><slot /></div>
    </div>
</template>

<script>
export default {
    props: {
        icon: { type: String }
    }
};
</script>
