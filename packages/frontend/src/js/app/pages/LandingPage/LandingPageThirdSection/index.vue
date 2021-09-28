<template>
    <div>
        <div class="max-w-screen-sm mx-auto">
            <h2 class="text-display-lg">
                {{ $t("landingPage.thirdSection.firstParagraph.title") }}
            </h2>

            <div class="mt-4">
                {{ $t("landingPage.thirdSection.firstParagraph.body.text1") }}
                <a
                    class="link"
                    href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles"
                    >{{
                        $t("landingPage.thirdSection.firstParagraph.body.link1")
                    }}</a
                >,
                {{ $t("landingPage.thirdSection.firstParagraph.body.text2") }}.
                <span class="font-bold">
                    {{
                        $t("landingPage.thirdSection.firstParagraph.body.text3")
                    }}
                </span>
                {{ $t("landingPage.thirdSection.firstParagraph.body.text4") }}
                <a
                    class="link"
                    href="https://beta.gouv.fr/startups/resorption-bidonvilles.html"
                    >{{
                        $t(
                            "landingPage.thirdSection.firstParagraph.body.link2"
                        )
                    }}.</a
                >
            </div>

            <div class="mt-8">
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

            <div
                class="flex flex-row flex-wrap items-center justify-between mt-8"
            >
                <a href="https://solidarites-sante.gouv.fr/"
                    ><img class="h-24 m-2" src="./assets/logo-gouvernement.jpg"
                /></a>
                <a href="https://ec.europa.eu/info/index_en"
                    ><img
                        class="h-24 my-2"
                        src="./assets/logo-commission-europenne.png"
                /></a>
            </div>
            <div
                class="flex flex-row flex-wrap items-center justify-between mt-8"
            >
                <a href="https://beta.gouv.fr/approche/incubateurs/mtes.html"
                    ><img
                        class="h-24 m-2"
                        src="./assets/logo-fabrique-numerique.png"
                /></a>
                <a href="https://beta.gouv.fr/"
                    ><img class="h-20 m-2" src="./assets/logo_beta-gouv-fr.jpg"
                /></a>
                <a
                    href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2019/resorption-bidonvilles.html"
                    ><img
                        class="h-16 m-2"
                        src="./assets/logo-entrepreneur-interet-general.png"
                /></a>
            </div>
        </div>
    </div>
</template>
