<template>
    <div
        v-if="shouldBeVisible"
        class="full-width h-auto mx-auto mt-8 mb-16 bg-orange300 rounded-lg overflow-hidden"
    >
        <div class="lg:flex items-center">
            <div class="lg:flex-shrink-0 justify-center">
                <img class="h-48 m-4" src="./assets/Webinar.jpeg" alt="" />
            </div>
            <div class="flex-shrink-0 lg:flex-shrink px-8 py-2 lg:py-8 lg:px-4">
                <div class="tracking-wide text-display-md text-primary">
                    Instruction du 25 janvier 2018 sur la résorption des
                    bidonvilles, où en est-on 3 ans après ?
                </div>
                <div class="mt-2">
                    Un bilan d'étape organisé par la Dihal où 3 acteurs
                    livreront également leurs analyses.
                </div>
                <div class="mt-2 text-md">
                    Informations et inscription :
                    <a
                        class="text-primary"
                        href="https://hello.idealco.fr/inscription-formation-resorptionbidonvilles/"
                        >https://hello.idealco.fr/inscription-formation-resorptionbidonvilles/</a
                    >
                </div>
            </div>
            <div class="px-8 py-2 lg:p-8">
                <a
                    href="https://hello.idealco.fr/inscription-formation-resorptionbidonvilles/"
                    target="_blank"
                >
                    <Button class="my-2" variant="secondary">S'inscrire</Button>
                </a>
                <p class="text-sm font-bold">Lundi 31 mai de 15h à 16h30</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        shouldBeVisible() {
            return new Date() < new Date("2021-06-01");
        }
    }
};
</script>
