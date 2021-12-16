<template>
    <div>
        <div class="mx-auto flex flex-col lg:flex-row">
            <div class="lg:max-w-sm">
                <span class="font-bold">
                    {{
                        $t("landingPage.thirdSection.firstParagraph.body.text1")
                    }}
                    <span class="italic">{{
                        $t("landingPage.thirdSection.firstParagraph.body.text2")
                    }}</span>
                    {{
                        $t("landingPage.thirdSection.firstParagraph.body.text3")
                    }}
                </span>
                (<a
                    class="link"
                    href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles"
                    >Dihal</a
                >).
                {{
                    $t("landingPage.thirdSection.firstParagraph.body.text4")
                }}.<br />
                {{ $t("landingPage.thirdSection.firstParagraph.body.text5") }}
                <a
                    class="link"
                    href="https://beta.gouv.fr/startups/resorption-bidonvilles.html"
                    >{{
                        $t(
                            "landingPage.thirdSection.firstParagraph.body.link1"
                        )
                    }}.</a
                >
            </div>

            <div class="mt-6 lg:mt-0 lg:pl-8">
                <div>
                    {{
                        $t(
                            "landingPage.thirdSection.firstParagraph.items.title"
                        )
                    }}
                </div>

                <ul class="list-disc ml-8">
                    <li>
                        <a
                            class="link"
                            href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2019/resorption-bidonvilles.html"
                            >{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.items.1.link"
                                )
                            }}</a
                        >
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.items.1.text"
                            )
                        }}
                    </li>
                    <li>
                        <a
                            class="link"
                            href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/org-details/999999999/project/881989/program/31076817/details"
                            >{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.items.2.link"
                                )
                            }}</a
                        >{{
                            $t(
                                "landingPage.thirdSection.firstParagraph.items.2.text"
                            )
                        }}
                    </li>
                    <li>
                        <a
                            class="link"
                            href="https://beta.gouv.fr/approche/fast/03-fast.html"
                            >{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.items.3.link"
                                )
                            }}</a
                        >
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.items.3.text"
                            )
                        }}
                    </li>
                    <li>
                        <a
                            class="link"
                            href="https://www.modernisation.gouv.fr/action-publique-2022/fonds-pour-la-transformation-de-laction-publique/ftap-112-millions-deuros-pour-les-19-projets-laureats"
                            >{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.items.4.link"
                                )
                            }}</a
                        >
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.items.4.text"
                            )
                        }}
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="flex flex-row flex-wrap items-center justify-center mt-8 lg:flex-no-wrap lg:justify-between"
        >
            <a href="https://solidarites-sante.gouv.fr/"
                ><g-image
                    width="200"
                    class="h-20 m-2"
                    src="./assets/logo-gouvernement.jpg"
            /></a>
            <a href="https://ec.europa.eu/info/index_en"
                ><g-image
                    width="460"
                    class="h-20 m-2"
                    src="./assets/logo-commission-europenne.png"
            /></a>
            <a href="https://beta.gouv.fr/approche/incubateurs/mtes.html"
                ><g-image
                    width="96"
                    class="h-22 m-2"
                    src="./assets/logo-fabrique-numerique.png"
            /></a>
            <a class="pl-12" href="https://beta.gouv.fr/"
                ><g-image
                    width="160"
                    class="h-20 m-2"
                    src="./assets/logo_beta-gouv-fr.jpg"
            /></a>
            <a
                class="pl-12"
                href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2019/resorption-bidonvilles.html"
                ><g-image
                    width="330"
                    class="h-16 m-2"
                    src="./assets/logo-entrepreneur-interet-general.png"
            /></a>
        </div>
    </div>
</template>
