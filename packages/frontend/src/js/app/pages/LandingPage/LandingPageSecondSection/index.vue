<template>
    <div>
        <div class="md:grid md:grid-cols-3 md:gap-16">
            <LandingPageDataBlock
                :line1="$t('landingPage.secondSection.data.1.line1')"
                :line2="$t('landingPage.secondSection.data.1.line2')"
                :line3="$t('landingPage.secondSection.data.1.line3')"
            />
            <LandingPageDataBlock
                class="my-4 md:my-0"
                :line1="$t('landingPage.secondSection.data.2.line1')"
                :line2="$t('landingPage.secondSection.data.2.line2')"
                :line3="$t('landingPage.secondSection.data.2.line3')"
            />
            <LandingPageDataBlock
                :line1="$t('landingPage.secondSection.data.3.line1')"
                :line2="$t('landingPage.secondSection.data.3.line2')"
                :line3="$t('landingPage.secondSection.data.3.line3')"
            />
        </div>

        <div class="max-w-screen-sm mx-auto ">
            <h2 class="mt-16">
                <span class="text-display-lg font-normal">{{
                    $t("landingPage.secondSection.title")
                }}</span>
            </h2>

            <div class="mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.firstParagraph.bold")
                }}</span>
                {{ $t("landingPage.secondSection.firstParagraph.normal") }}
            </div>
            <div>
                <a
                    class="link"
                    href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles"
                    >{{
                        $t("landingPage.secondSection.firstParagraph.link")
                    }}</a
                >
            </div>

            <div class="mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.secondParagraph.bold")
                }}</span
                ><br />
                {{ $t("landingPage.secondSection.secondParagraph.normal") }}
            </div>

            <div
                class="mt-8"
                v-if="$t('landingPage.secondSection.thirdParagraph')"
            >
                <span class="font-bold">{{
                    $t("landingPage.secondSection.thirdParagraph.bold")
                }}</span
                ><br />
                {{ $t("landingPage.secondSection.thirdParagraph.normal") }}
            </div>

            <img
                width="640"
                v-if="$i18n.locale === 'fr'"
                class="mt-20 w-full"
                src="./assets/map-fr.jpg"
            />
            <img
                width="640"
                v-if="$i18n.locale === 'en'"
                class="mt-20 w-full"
                src="./assets/map-en.jpg"
            />
            <img
                width="640"
                v-if="$i18n.locale === 'bg'"
                class="mt-20 w-full"
                src="./assets/map-bg.jpg"
            />
            <img
                width="640"
                v-if="$i18n.locale === 'ro'"
                class="mt-20 w-full"
                src="./assets/map-ro.jpg"
            />
        </div>
        <div class="mt-20 md:flex md:flex-row items-center">
            <div class="block md:hidden mb-4 text-display-lg">
                {{ $t("landingPage.secondSection.video.text") }}
            </div>
            <div class="md:w-1/2 md:mr-16 bg-gray-500">
                <video
                    poster="./assets/poster_rb_connaitre_partager_agir.png"
                    controls
                >
                    <source
                        src="./assets/rb_connaitre_partager_agir_720.mp4"
                        type="video/mp4"
                    />
                    Votre navigateur ne supporte pas la balise video.
                </video>
            </div>
            <div class="hidden md:block w-1/2 text-display-lg">
                {{ $t("landingPage.secondSection.video.text") }}
            </div>
        </div>

        <div class="mt-20 max-w-screen-sm mx-auto">
            <h2 class="text-display-lg">
                {{ $t("landingPage.secondSection.bilan.title") }}
            </h2>
            <div class=" mt-8">
                <span class="font-bold">{{
                    $t("landingPage.secondSection.bilan.firstParagraph.bold")
                }}</span>
                {{
                    $t("landingPage.secondSection.bilan.firstParagraph.normal")
                }}
            </div>

            <div class="flex flex-row items-center my-8">
                <div class="bg-gray-500 h-px flex-1" />
                <div
                    class="inline-block bg-black text-white text-display-md px-4"
                >
                    2020
                </div>
                <div class="bg-gray-500 h-px flex-1" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-16">
                <LandingPageBilanBlock
                    icon="map-marker-alt"
                    :text="$t('landingPage.secondSection.bilan.figures.1.text')"
                />
                <LandingPageBilanBlock
                    icon="users"
                    :text="$t('landingPage.secondSection.bilan.figures.2.text')"
                />
                <LandingPageBilanBlock
                    icon="hand-holding-medical"
                    :text="$t('landingPage.secondSection.bilan.figures.3.text')"
                />
                <LandingPageBilanBlock
                    icon="school"
                    :text="$t('landingPage.secondSection.bilan.figures.4.text')"
                />
                <LandingPageBilanBlock
                    icon="file-signature"
                    :text="$t('landingPage.secondSection.bilan.figures.6.text')"
                />
                <LandingPageBilanBlock
                    icon="book"
                    :text="$t('landingPage.secondSection.bilan.figures.5.text')"
                    :info="$t('landingPage.secondSection.bilan.figures.5.info')"
                />
            </div>
            <div class="text-center mt-8">
                <a
                    target="_blank"
                    v-if="$i18n.locale === 'fr'"
                    href="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2021/10/point_detape_2019-2020_-_resorption_des_bidonvilles_vweb.pdf"
                >
                    <Button variant="secondary">
                        {{ $t("landingPage.secondSection.bilan.cta") }}
                    </Button>
                </a>
                <a
                    target="_blank"
                    v-else
                    href="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2022/01/eng_slum_clearance_-_progress_report_2021.pdf"
                >
                    <Button variant="secondary">
                        {{ $t("landingPage.secondSection.bilan.cta") }}
                    </Button>
                </a>
            </div>
        </div>

        <LandingPageContributeBanner v-if="$i18n.locale === 'fr'" />
    </div>
</template>

<script>
import LandingPageDataBlock from "./LandingPageDataBlock.vue";
import LandingPageContributeBanner from "../LandingPageContributeBanner.vue";
import LandingPageBilanBlock from "./LandingPageBilanBlock.vue";
import Button from "#app/components/ui/Button.vue";

export default {
    components: {
        LandingPageDataBlock,
        LandingPageContributeBanner,
        LandingPageBilanBlock,
        Button
    }
};
</script>
