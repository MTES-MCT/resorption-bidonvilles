<template>
    <div class="bg-yellow-200 py-6 px-4 mb-8 flex items-center justify-between">
        <div>
            <div
                class="rounded-full inline-block bg-yellow-400 w-6 h-6 text-center text-xs align-middle leading-6"
            >
                <Icon icon="flag"></Icon>
            </div>
            <span class="ml-2 font-bold">Vous intervenez sur ce site ?</span>
            <span class="ml-2">Faites le savoir à la communauté</span>
        </div>
        <div>
            <Button @click="click">J'interviens sur ce site</Button>
            <span class="ml-2" @click="close"
                ><Icon icon="times" class="cursor-pointer"></Icon
            ></span>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        click() {
            this.$emit("click");
        },
        close() {
            this.$emit("close");
        }
    }
};
</script>
