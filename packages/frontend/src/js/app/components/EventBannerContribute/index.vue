<template>
    <div class="flex items-stretch border-solid mb-8" v-if="shouldBeVisible">
        <Button
            icon="external-link-alt"
            class="justify-self-start flex-shrink-0 px-4 py-6"
            size="lg"
            variant="specialEvent"
            iconPosition="left"
            target="blank"
            href="https://www.demarches-simplifiees.fr/commencer/contributions-cadre-europeen-roms"
            >Je contribue</Button
        >
        <div class="justify-self-start ml-4 mt-2">
            <div class="font-bold text-display-sm">
                Contribuez à la préparation de la stratégie française en réponse
                au
                <a
                    class="link"
                    target="_blank"
                    href="https://eur-lex.europa.eu/legal-content/FR-EN/TXT/?from=EN&uri=CELEX%3A32021H0319%2801%29"
                >
                    cadre européen 2020-2030 pour l'&laquo;inclusion des
                    Roms&raquo;</a
                >
            </div>
            <div>
                <a
                    class="link"
                    target="_blank"
                    href="https://www.gouvernement.fr/la-dihal-va-lancer-une-concertation-interministerielle-pour-l-elaboration-d-une-strategie-nationale"
                    >En savoir plus</a
                >.
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
