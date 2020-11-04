<template>
    <div class="flex justify-between">
        <div>
            <div class="flex items-center">
                <slot />
            </div>
            <div>
                <div class="text-display-lg">{{ title }}</div>
            </div>
        </div>
        <div class="flex items-center">
            <Button
                icon="file-excel"
                iconPosition="left"
                variant="primaryOutline"
                class="mr-2"
                >Exporter</Button
            >
            <Button icon="plus" iconPosition="left" variant="primary">
                Déclarer un nouveau site</Button
            >
        </div>
    </div>
</template>

<script>
export default {
    props: {
        search: {
            type: Object
        }
    },
    computed: {
        title() {
            if (this.search) {
                return `Bidonvilles et squats : ${this.search.label}`;
            }

            return `Bidonvilles et squats`;
        }
    }
};
</script>
