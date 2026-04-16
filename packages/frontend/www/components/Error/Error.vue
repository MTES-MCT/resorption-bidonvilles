<template>
    <section id="main-content" class="fr-container fr-my-md-12w fr-my-7w">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
            <div class="fr-col-12 fr-col-md-6 fr-col-offset-md-1 fr-py-0 fr-mb-7w fr-mb-md-0">
                <h1>{{ errorMessage}}</h1>
                <p class="fr-text--xs fr-text-mention--grey fr-mb-3w">Erreur {{ statusCode }}</p>
                <p class="fr-text--xl fr-mb-4w">
                    Vous souhaitiez agir pour la résorption des
                    bidonvilles mais {{ errorDetails }}. Excusez-nous pour la gêne occasionnée.
                </p>

                <p class="fr-text--sm fr-mb-0">
                    Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu’elle est correcte. La page n’est peut-être plus disponible.
                    <br/>
                    Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil.
                </p>
                <DsfrButtonGroup 
                    class="fr-mt-5w"
                    inlineLayoutWhen="md"
                    :buttons="[
                        {
                            label: 'Aller à la page d\'accueil',
                            title: 'Aller à la page d\'accueil',
                            onClick: redirectToHome
                        }
                    ]"
                />
            </div>
            <div class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-py-0 fr-px-9w fr-px-md-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="fr-responsive-img fr-artwork"
                    viewBox="0 0 160 200"
                    :aria-hidden="true"
                    :data-fr-js-ratio="true"
                >
                    <g>
                        <use
                        class="fr-artwork-motif"
                        :href="`${ovoidSvgPath}#artwork-motif`"
                        x="0"
                        y="0"
                        width="160"
                        height="200"
                    />
                    <use
                        class="fr-artwork-background"
                        :href="`${ovoidSvgPath}#artwork-background`"
                        x="0"
                        y="0"
                        width="160"
                        height="200"
                    />
                    </g>
                    <g>
                        <use
                            class="fr-artwork-decorative"
                            :href="`${technicalErrorSvgPath}#artwork-decorative`"
                            x="40"
                            y="50"
                            width="80"
                            height="80"
                        />
                        <use
                            class="fr-artwork-minor"
                            :href="`${technicalErrorSvgPath}#artwork-minor`"
                            x="40"
                            y="50"
                            width="80"
                            height="80"
                        />
                        <use
                            class="fr-artwork-major"
                            :href="`${technicalErrorSvgPath}#artwork-major`"
                            x="40"
                            y="50"
                            width="80"
                            height="80"
                        />
                    </g>
                </svg>
            </div>
        </div>
    </section>
</template>

<script setup>
import redirectToHome from '~~/utils/redirectToHome';
const props = defineProps({
    error: {
        type: Object,
        default: null
    }
});

const statusCode = computed(() => props.error?.statusCode ?? 'inconnue')
const errorMessage = computed(() => props.error?.statusCode === 404 ? 'Page non trouvée' : 'Une erreur est survenue')
const errorDetails = computed(() => props.error?.statusCode === 404 ? 'la page que vous recherchez n\'existe pas ou est introuvable' : 'il semblerait qu\'une erreur se soit produite');

// Affichage d'une image d'erreur technique
const ovoidSvgPath = '/artwork/background/ovoid.svg';
const technicalErrorSvgPath = '/artwork/pictograms/system/technical-error.svg';
</script>


