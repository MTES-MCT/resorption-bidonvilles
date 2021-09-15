<template>
    <div>
        <div
            class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50"
            v-if="toggleModal"
        >
            <div
                class="bg-white relative mx-auto w-auto max-w-2xl border-2 border-black"
            >
                <div class="p-8 w-full flex flex-col">
                    <Button variant="primaryText" @click="toggleModal = false">
                        Fermer X
                    </Button>
                    <div class="text-display-md text-secondary">Evènement</div>
                    <div class="text-display-md text-blue-600">
                        jeudi 23 septembre de 10h à 12h
                    </div>
                    <img
                        class="mt-4"
                        src="./assets/webinaire_acces_a_l_eau.jpg"
                    />
                </div>
                <div class="mx-8 mt-4 mb-8 flex justify-between">
                    <Button>En savoir plus</Button>
                    <Button variant="secondary">Je m'inscris</Button>
                </div>
            </div>
        </div>
        <div
            v-if="toggleModal"
            class="absolute inset-0 z-40 opacity-50 bg-black"
        ></div>
    </div>
</template>
<script>
export default {
    name: "NewsPopup",
    data() {
        return {
            toggleModal: true
        };
    }
};
</script>
