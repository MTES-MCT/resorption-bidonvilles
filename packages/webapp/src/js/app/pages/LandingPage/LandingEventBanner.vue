<template>
    <div
        v-if="shouldBeVisible"
        class="full-width h-auto mx-auto mt-8 mb-16 bg-orange300 rounded-lg overflow-hidden"
    >
        <div class="lg:flex items-center">
            <div class="lg:flex-shrink-0 justify-center">
                <img
                    class="m-4"
                    width="290"
                    src="./assets/banniere_access_eau.jpg"
                    alt=""
                />
            </div>
            <div class="flex-shrink-0 lg:flex-shrink px-8 py-2 lg:py-8 lg:px-4">
                <div class="tracking-wide text-display-md text-primary">
                    L'accès à l'eau dans les bidonvilles : un droit et un enjeu
                    de santé publique essentiels à une stratégie de résorption
                </div>
                <div class="mt-2">
                    En partenariat avec l'ONG Solidarités International et la
                    Direction de l'eau et de la biodiversité du MTES, découvrez
                    pourquoi et comment l'accès à l'eau est possible dans les
                    bidonvilles et constitue un des éléments essentiels d'une
                    stratégie de résorption.
                    <Link
                        to="https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/"
                        >En savoir plus.</Link
                    >
                </div>
            </div>
            <div class="px-8 py-2 lg:p-8">
                <a
                    href="https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/"
                    target="_blank"
                >
                    <Button class="my-2" variant="secondary"
                        >Je m'inscris</Button
                    >
                </a>
                <p class="text-sm font-bold">
                    Jeudi 23 septembre de 10 h à 12 h
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        shouldBeVisible() {
            return new Date() < new Date("2021-09-24");
        }
    }
};
</script>
