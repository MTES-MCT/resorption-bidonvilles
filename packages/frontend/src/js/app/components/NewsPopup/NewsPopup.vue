<template>
    <div>
        <div
            class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50"
            v-if="toggleModalPopup && shouldBeVisible"
        >
            <div
                class="bg-white relative mx-auto w-auto max-w-2xl border-2 border-black"
            >
                <div class="p-8 w-full flex flex-col">
                    <Button
                        variant="primaryText"
                        @click="$emit('updateToggleModal')"
                    >
                        Fermer X
                    </Button>
                    <div class="text-display-md text-secondary">
                        {{ popup.title }}
                    </div>
                    <div class="text-display-md text-primary">
                        {{ popup.text }}
                    </div>
                    <img class="mt-4" :src="popup.imageName" />
                </div>
                <div class="mx-8 mt-4 mb-8 flex justify-between">
                    <a :href="popup.infoLink" target="_blank">
                        <Button>En savoir plus</Button>
                    </a>
                    <a :href="popup.joinLink" target="_blank">
                        <Button variant="secondary">Je m'inscris</Button>
                    </a>
                </div>
            </div>
        </div>
        <div
            v-if="toggleModalPopup && shouldBeVisible"
            class="fixed inset-0 z-40 opacity-50 bg-black"
        ></div>
    </div>
</template>
<script>
export default {
    name: "NewsPopup",
    props: {
        popup: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            toggleModalPopup: this.popup.toggleModal
        };
    },
    computed: {
        shouldBeVisible() {
            return new Date() < new Date(this.popup.maxDate);
        }
    }
};
</script>
