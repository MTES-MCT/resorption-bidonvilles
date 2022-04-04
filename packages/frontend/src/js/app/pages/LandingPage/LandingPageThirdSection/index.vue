<template>
    <div id="equipe">
        <h2 class="text-center text-display-lg text-primary mb-10">
            {{ $t("footer.aboutUs") }}
        </h2>

        <div class="max-w-screen-lg">
            <div class="mx-auto flex flex-col lg:flex-row">
                <div class="lg:w-6/12 lg:pr-6">
                    <div v-if="$i18n.locale === 'fr'">
                        <p>
                            La start-up d’État
                            <span class="font-italic"
                                >Résorption-bidonvilles</span
                            >, lancée fin 2018, est portée par la
                            <a
                                href="https://www.gouvernement.fr/delegation-interministerielle-a-l-hebergement-et-a-l-acces-au-logement"
                                class="link font-bold"
                                >Dihal (Délégation interministérielle à
                                l’hébergement et à l’accès au logement)</a
                            >, administration centrale chargée notamment du
                            suivi de la politique de résorption des bidonvilles.
                            Ainsi, elle est
                            <span class="font-bold">en lien direct</span> et
                            s'inscrit dans un objectif de transformation de
                            <span class="font-bold">l’action publique</span>.
                        </p>

                        <p class="mt-4">
                            L’équipe conçoit le produit et ses développements en
                            fonction de leurs impacts sur la politique de
                            résorption et l’usage de l’outil.
                            Résorption-bidonvilles est développée
                            <span class="font-bold">de manière itérative</span>
                            (méthode agile) afin d’adapter en permanence l’outil
                            aux besoins des utilisateurs.
                            <span class="font-bold"
                                >Aller à la rencontre des utilisateurs</span
                            >
                            est dans l’ADN des start-up d’État et se traduit par
                            des déplacements terrain, des interviews, des phases
                            d’expérimentation…
                        </p>
                    </div>
                    <p v-else>
                        <span class="font-bold">
                            {{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.text1"
                                )
                            }}
                            <span class="italic">{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.text2"
                                )
                            }}</span>
                            {{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.text3"
                                )
                            }}
                        </span>
                        (<a
                            class="link"
                            href="https://www.ecologie.gouv.fr/resorption-des-campements-illicites-et-des-bidonvilles"
                            >Dihal</a
                        >).
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.body.text4"
                            )
                        }}.<br />
                        {{
                            $t(
                                "landingPage.thirdSection.firstParagraph.body.text5"
                            )
                        }}
                        <a
                            class="link"
                            href="https://beta.gouv.fr/startups/resorption-bidonvilles.html"
                            >{{
                                $t(
                                    "landingPage.thirdSection.firstParagraph.body.link1"
                                )
                            }}.</a
                        >
                    </p>

                    <div class="mt-4">
                        <div class="font-bold">
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
                                    href="https://eig.etalab.gouv.fr/defis/resorption-bidonvilles/"
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

                <div class="mt-10 lg:w-6/12 lg:mt-0 lg:pl-6">
                    <img width="1124" class="h-auto" src="./assets/team.jpg" />
                    <ul class="mt-4">
                        <li>
                            <span class="font-bold">Manuel Demougeot</span> :
                            directeur de cabinet et du pôle résorption
                            bidonvilles, co-intrapreneur
                        </li>
                        <li>
                            <span class="font-bold">Laure Dubuc</span> : cheffe
                            de projet et co-intrapreneur
                        </li>
                        <li>
                            <span class="font-bold">Jean-Paul Domalain</span> :
                            chef de produit
                        </li>
                        <li>
                            <span class="font-bold"
                                >Christophe Benard, Anis Safine et Grégoire
                                Thomazeau</span
                            >
                            : développeurs
                        </li>
                        <li>
                            <span class="font-bold"
                                >Wendy Boukobza, Charlotte Piana</span
                            >
                            : chargées de déploiement
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div
            class="flex flex-row flex-wrap items-center justify-center mt-8 lg:flex-no-wrap lg:justify-between"
        >
            <a href="https://solidarites-sante.gouv.fr/"
                ><img
                    width="200"
                    class="h-auto m-2"
                    src="./assets/logo-gouvernement.jpg"
            /></a>
            <a href="https://ec.europa.eu/info/index_en"
                ><img
                    width="460"
                    class="h-auto m-2"
                    src="./assets/logo-commission-europenne.png"
            /></a>
            <a href="https://beta.gouv.fr/approche/incubateurs/mtes.html"
                ><img
                    width="96"
                    class="h-auto m-2"
                    src="./assets/logo-fabrique-numerique.png"
            /></a>
            <a class="pl-12" href="https://beta.gouv.fr/"
                ><img
                    width="160"
                    class="h-auto m-2"
                    src="./assets/logo_beta-gouv-fr.jpg"
            /></a>
            <a
                class="pl-12"
                href="https://eig.etalab.gouv.fr/defis/resorption-bidonvilles/"
                ><img
                    width="330"
                    class="h-auto m-2"
                    src="./assets/logo-entrepreneur-interet-general.png"
            /></a>
        </div>
    </div>
</template>
