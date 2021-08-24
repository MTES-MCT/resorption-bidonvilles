<template>
    <div class="flex items-stretch border-solid mb-8" v-if="shouldBeVisible">
        <Button
            icon="calendar"
            class="justify-self-start flex-shrink-0 px-4 py-6"
            size="lg"
            variant="specialEvent"
            iconPosition="left"
            target="blank"
            href="https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/"
            >Je m'inscris
        </Button>
        <div class="justify-self-start ml-4 mt-2">
            <div class="font-bold text-display-sm">
                Jeudi 23 septembre de 10h à 12h : webinaire sur l'accès à l'eau
                dans les bidonvilles : un droit et un enjeu de santé publique
                essentiels à une stratégie de résorption.
            </div>
            <div>
                <a
                    class="link"
                    target="_blank"
                    href="https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/"
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
            return (
                new Date() >= new Date("2021-09-01") &&
                new Date() <= new Date("2021-09-23")
            );
        }
    }
};
</script>
