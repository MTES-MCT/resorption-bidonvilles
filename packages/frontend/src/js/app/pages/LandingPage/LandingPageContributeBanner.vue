<template>
    <div
        class="full-width h-auto mx-auto mt-16 mb-4 bg-blue200 rounded-lg overflow-hidden"
        v-if="shouldBeVisible"
    >
        <div class="lg:flex">
            <div class="lg:flex-shrink-0 justify-center">
                <g-image
                    class="m-4"
                    width="240"
                    src="./assets/appel-a-contribution-inclusion-roms.jpg"
                    alt=""
                />
            </div>
            <div class="flex-shrink-0 lg:flex-shrink px-8 py-2 lg:py-8 lg:px-4">
                <div class="tracking-wide text-display-md text-primary">
                    Contribuez à la préparation de la stratégie française en
                    réponse au cadre européen 2020-2030 pour l'&laquo;inclusion
                    des Roms&raquo;
                </div>
                <a
                    href="https://www.gouvernement.fr/la-dihal-va-lancer-une-concertation-interministerielle-pour-l-elaboration-d-une-strategie-nationale"
                    class="link"
                    target="blank"
                    >En savoir plus</a
                >
            </div>
            <div class="flex-shrink-0 px-8 py-2 lg:p-8">
                <a
                    href="https://www.demarches-simplifiees.fr/commencer/contributions-cadre-europeen-roms"
                    target="_blank"
                >
                    <Button class="my-2" size="md" variant="primary"
                        ><div class="whitespace-nowrap">
                            Je contribue
                        </div></Button
                    >
                </a>
                <p class="text-sm font-bold">Dès maintenant</p>
                <p class="text-sm font-bold">jusqu'en septembre 2021</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        shouldBeVisible() {
            return new Date() < new Date("2021-09-01");
        }
    }
};
</script>
