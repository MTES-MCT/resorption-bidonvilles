<template>
    <footer>
        <section class="bg-blue100 py-8">
            <ContentWrapper class="flex flex-col lg:flex-row md:justify-between">
                <FooterBarNewsletter v-if="$i18n.locale === 'fr'" />
                <FooterBarHotline :CONTACT_EMAIL="CONTACT_EMAIL" />
                <FooterBarSocialMedia />
            </ContentWrapper>
        </section>

        <ContentWrapper class="mt-4 lg:mt-8">
            <div class="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
                <IdentiteVisuelle class="-ml-3" :keepLogo="true" size="large" />
                <div class="flex space-x-3">
                    <FooterBarPartnerLink
                        href="https://www.gouvernement.fr/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement">
                        DIHAL</FooterBarPartnerLink>
                    <FooterBarPartnerLink href="https://beta.gouv.fr">beta.gouv.fr</FooterBarPartnerLink>
                </div>
            </div>
            <div class="border-t mt-4 pt-4 pb-8 flex flex-wrap gap-4 items-center">
                <FooterBarFootLink to="https://github.com/MTES-MCT/resorption-bidonvilles"
                    title="Accéder au dépôt du code source de l'application">
                    <Icon icon="fa-brands fa-github" class="mr-1" />{{ $t('footer.sourceCode') }}
                </FooterBarFootLink>
                <span class="w-px bg-G300 mx-3 h-4 hidden md:inline"></span>

                <FooterBarFootLink :to="`${(URL || '')}/statistiques-publiques`"
                    title="Afficher les statistiques publiques de la plateforme">
                    {{ $t('footer.statistics') }}
                </FooterBarFootLink>
                <span class="w-px bg-G300 mx-3 h-4 hidden md:inline"></span>

                <FooterBarFootLink :to="`${(URL || '')}/mentions-legales`"
                    title="Afficher les mentions légales relatives à l'utilisation de la plateforme">
                    {{ $t('footer.legal') }}
                </FooterBarFootLink>
                <span class="w-px bg-G300 mx-3 h-4 hidden md:inline"></span>

                <FooterBarFootLink :to="`${(URL || '')}/doc/conditions-d-utilisation.pdf`"
                    title="Afficher les conditions générales d'utilisation de la plateforme">
                    {{ $t('footer.cgus') }}
                </FooterBarFootLink>
                <span class="w-px bg-G300 mx-3 h-4 hidden md:inline"></span>

                <FooterBarFootLink :to="`${(URL || '')}/accessibilite`"
                    title="Afficher la définition du référentiel général d'amélioration de l'accessibilité">
                    {{ $t('footer.RGAA') }}
                </FooterBarFootLink>
                <span class="w-px bg-G300 mx-3 h-4 hidden md:inline"></span>

                <router-link to="/plan-du-site" v-if="showSiteMapLink"
                    class="text-xs border-b-2 border-transparent hover:border-G500" :class="focusClasses.ring">
                    {{ $t('footer.siteMap') }}
                </router-link>
                <span class="w-px bg-G300 mx-3 h-4 hidden md:inline"></span>
            </div>
        </ContentWrapper>
    </footer>
</template>

<script setup>
import { toRefs } from "vue";
import focusClasses from '../../../../common/utils/focus_classes';
import Icon from "../Icon.vue";
import ContentWrapper from "../ContentWrapper.vue";
import IdentiteVisuelle from "../IdentiteVisuelle/IdentiteVisuelle.vue";
import FooterBarNewsletter from "./FooterBarNewsletter.vue";
import FooterBarHotline from "./FooterBarHotline.vue";
import FooterBarSocialMedia from "./FooterBarSocialMedia.vue";
import FooterBarFootLink from "./FooterBarFootLink.vue";
import FooterBarPartnerLink from "./FooterBarPartnerLink.vue";

const props = defineProps({
    CONTACT_EMAIL: String,
    URL: String,
    showSiteMapLink: {
        type: Boolean,
        required: false,
        default: false
    }
});
const { CONTACT_EMAIL, URL, showSiteMapLink } = toRefs(props);
</script>
