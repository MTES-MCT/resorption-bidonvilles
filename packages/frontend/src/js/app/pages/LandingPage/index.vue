<template>
    <PublicLayout :displayLanguagePicker="true">
        <PublicContainer>
            <div class="pt-4 text-center"></div>
            <news-popup
                :popup="popup"
                v-if="popup.toggleModal"
                v-on:updateToggleModal="updateToggleModal"
            ></news-popup>
            <div class="pt-4">
                <div class="max-w-screen-lg mx-auto pb-20">
                    <LandingPageHero class="mt-20" />
                    <LandingPageFirstSection />
                </div>
            </div>
        </PublicContainer>
        <PublicContainer>
            <div class="pt-4">
                <div class="max-w-screen-lg mx-auto pb-20">
                    <LandingDiscoverBanner v-if="$i18n.locale === 'fr'" />
                    <LandingTutorialBanner v-if="$i18n.locale === 'fr'" />
                </div>
            </div>
        </PublicContainer>
        <LandingPageBanner :cta="$t('landingPage.firstBanner.cta')">
            {{ $t("landingPage.firstBanner.text") }}
        </LandingPageBanner>
        <CreditWrapper credit="© Diego Inglez de Souza">
            <img
                class="h-128 w-full object-cover object-center"
                src="./assets/resorption-bidonvilles-1.jpg"
            />
        </CreditWrapper>
        <PublicContainer>
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageSecondSection />
            </div>
        </PublicContainer>
        <LandingPageBanner :cta="$t('landingPage.secondBanner.cta')">
            {{ $t("landingPage.secondBanner.text") }}
        </LandingPageBanner>
        <CreditWrapper credit="© Ville de Strasbourg">
            <img
                class="h-128 w-full object-cover object-top"
                src="./assets/resorption-bidonvilles-2.jpg"
            />
        </CreditWrapper>
        <PublicContainer>
            <div class="max-w-screen-lg mx-auto py-20">
                <LandingPageThirdSection />
                <LandingPageNewsletter />
                <div class="text-center mt-24">
                    <h2 class="text-display-lg text-secondary">
                        {{ $t("landingPage.hero.subtitle") }}
                    </h2>
                    <LandingPageContactForm class="mx-auto" />
                </div>
            </div>
        </PublicContainer>
        <CreditWrapper credit="© Ville de Strasbourg">
            <div class="grid grid-cols-3 w-full gap-0">
                <img
                    class="h-64 w-full object-cover object-top"
                    src="./assets/resorption-bidonvilles-3.jpg"
                />
                <img
                    class="h-64 w-full object-cover object-top"
                    src="./assets/resorption-bidonvilles-4.jpg"
                />
                <img
                    class="h-64 w-full object-cover object-top"
                    src="./assets/resorption-bidonvilles-5.jpg"
                /></div
        ></CreditWrapper>
    </PublicLayout>
</template>

<script>
import PublicLayout from "#app/components/PublicLayout/index.vue";
import PublicContainer from "#app/components/PublicLayout/PublicContainer.vue";
import LandingPageHero from "./LandingPageHero/index.vue";
import LandingPageFirstSection from "./LandingPageFirstSection/index.vue";
import LandingPageSecondSection from "./LandingPageSecondSection/index.vue";
import LandingPageThirdSection from "./LandingPageThirdSection/index.vue";
import LandingPageBanner from "./LandingPageBanner.vue";
import LandingPageContactForm from "./LandingPageContactForm.vue";
import CreditWrapper from "./CreditWrapper.vue";
import LandingPageNewsletter from "./LandingPageNewsletter.vue";
import LandingTutorialBanner from "./LandingTutorialBanner";
import LandingDiscoverBanner from "./LandingDiscoverBanner";
import NewsPopup from "../NewsPopup/NewsPopup.vue";

export default {
    components: {
        CreditWrapper,
        PublicContainer,
        PublicLayout,
        LandingPageHero,
        LandingPageFirstSection,
        LandingPageSecondSection,
        LandingPageThirdSection,
        LandingPageBanner,
        LandingPageContactForm,
        LandingPageNewsletter,
        LandingTutorialBanner,
        LandingDiscoverBanner,
        NewsPopup
    },
    data() {
        return {
            popup: {
                toggleModal: false,
                name: "waterAccessWebinar",
                title: "Evènement",
                text: "jeudi 23 septembre de 10h à 12h",
                imgName: "webinaire_acces_a_l_eau.jpg",
                infoLink:
                    "https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/",
                joinLink:
                    "https://hello.idealco.fr/inscription-formation-dihal-acceseaubidonvilles/",
                maxDate: "2021-09-23"
            }
        };
    },
    methods: {
        updateToggleModal() {
            this.popup.toggleModal = !this.popup.toggleModal;
        },
        getCookie(name) {
            let matches = document.cookie.match(
                new RegExp(
                    "(?:^|; )" +
                        name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") +
                        "=([^;]*)"
                )
            );
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        setCookie(name, value, options = {}) {
            options = {
                path: "/",
                // add other defaults here if necessary
                ...options
            };

            if (options.expires instanceof Date) {
                options.expires = options.expires.toUTCString();
            }

            let updatedCookie =
                encodeURIComponent(name) + "=" + encodeURIComponent(value);

            for (let optionKey in options) {
                updatedCookie += "; " + optionKey;
                let optionValue = options[optionKey];
                if (optionValue !== true) {
                    updatedCookie += "=" + optionValue;
                }
            }

            document.cookie = updatedCookie;
        }
    },
    mounted() {
        const eventPopupCookie = this.getCookie(this.popup.name);
        if (!eventPopupCookie || eventPopupCookie == null) {
            setTimeout(() => {
                this.popup.toggleModal = true;
            }, 5000);
            this.setCookie(this.popup.name, "true", {
                secure: true
            });
        }
    }
};
</script>
