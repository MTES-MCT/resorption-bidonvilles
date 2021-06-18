<template>
    <div class="flex items-stretch border-solid mb-8" v-if="shouldBeVisible">
        <Button
            class="justify-self-start px-4 py-4"
            variant="specialEvent"
            target="blank"
            href="https://www.demarches-simplifiees.fr/commencer/contributions-cadre-europeen-roms"
            >Contribuer à la démarche</Button
        >
        <div class="justify-self-start ml-4 mt-2 italic">
            <div class="font-bold">
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
