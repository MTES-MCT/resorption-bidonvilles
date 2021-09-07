<template>
    <div>
        <h1 class="text-display-lg font-bold">Les questions récurrentes</h1>
        <Accordion class="ml-16 mt-6">
            <AccordionItem>
                <template v-slot:title
                    >Qui a accès à la plateforme ? Qui peut voir les données que
                    je partage ?</template
                >
                <template v-slot:content>
                    L’accès à la plateforme est uniquement
                    <span class="font-bold"
                        >ouvert aux acteurs de la résorption</span
                    >
                    c’est-à-dire aux correspondants départementaux représentant
                    les services de l’État dans les territoires (Préfectures,
                    DDETS), aux partenaires institutionnels (emploi, éducation,
                    santé), aux acteurs nationaux (Ministères, Directions
                    d’administration centrale, DIHAL), ainsi qu’aux opérateurs
                    (associations, collectifs).<br />
                    Les accès à la plateforme se font en fonction du territoire
                    de l’utilisateur, qui peut
                    <span class="font-bold italic"
                        >uniquement voir les informations partagées dans son
                        périmètre d’action</span
                    >. Ainsi, un utilisateur enregistré comme intervenant en
                    Seine-et-Marne ne pourra pas voir les données partagées au
                    sujet des sites présents en Essonne. Seuls les utilisateurs
                    enregistrés au niveau national (dans les ministères, au sein
                    des administrations centrales ou des partenaires associatifs
                    nationaux conventionnés) peuvent consulter l’intégralité des
                    données.<br />
                    <br />
                    <span class="font-bold italic">Le saviez-vous ?</span>
                    L’annuaire de la plateforme est ouvert à tous les
                    utilisateurs. Son utilisation participe à la mise en réseau
                    des partenaires locaux ou des pairs.
                </template>
            </AccordionItem>

            <AccordionItem>
                <template v-slot:title
                    >Quels sont les différents droits d’accès sur la plateforme
                    ? Qui peut faire quoi ?</template
                >
                <template v-slot:content>
                    Il existe 4 types d'accès sur la plateforme :
                    <ul class="list-disc pl-4">
                        <li>
                            <span class="font-bold"
                                >correspondant départemental</span
                            >
                            : il est le représentant local de l’État en charge
                            de la question des bidonvilles à l’échelle du
                            territoire (Préfecture et DDETS)
                        </li>
                        <li>
                            <span class="font-bold"
                                >partenaire institutionnel</span
                            >
                            : il est un acteur public impliqué dans le pilotage
                            et le suivi des actions menées, dans le champ de ses
                            compétences et prérogatives (Services de l’État,
                            établissements et organismes publics, collectivités
                            territoriales)
                        </li>
                        <li>
                            <span class="font-bold">opérateur</span> : il est la
                            structure chargée d’intervenir auprès des habitants
                            dans une perspective de résorption des bidonvilles
                            (associations, collectifs)
                        </li>
                        <li>
                            <span class="font-bold">acteur national</span> : il
                            est chargé de la mise en œuvre du cadre national.
                            Pour cela, il suit et évalue les actions. Il peut,
                            le cas échéant, apporter un soutien financier ou un
                            appui technique (Ministères, Dihal, direction
                            d’administrations centrales, associations nationales
                            conventionnées)
                        </li>
                    </ul>
                    <p class="mt-2">
                        Ces 4 accès permettent de consulter les informations sur
                        les sites à l’échelle de son territoire, de signaler ses
                        interventions et de laisser un message dans le journal
                        du site. Selon le périmètre d'intervention de l'acteur,
                        l'administrateur local peut étendre ses accès et ouvrir
                        la possibilité de mettre à jour, créer ou déclarer la
                        fermeture d'un site.
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem>
                <template v-slot:title
                    >Qui valide ma demande d’accès à la plateforme ?</template
                >
                <template v-slot:content
                    >Les demandes d’accès à la plateforme sont validées par des
                    administrateurs locaux, désignés par la DIHAL. Ils sont en
                    Préfecture et/ou dans une DDETS. Ces demandes sont évaluées
                    au cas par cas, puis validées ou non en fonction du champ
                    d’intervention, du rôle et du besoin du demandeur.</template
                >
            </AccordionItem>

            <AccordionItem>
                <template v-slot:title
                    >À quoi vont servir les informations renseignées sur la
                    plateforme ?</template
                >
                <template v-slot:content>
                    <p>
                        L’instruction du 25 janvier 2018 a donné une nouvelle
                        impulsion à la résorption des bidonvilles. Elle vise à
                        <span class="font-bold"
                            >dépasser une approche de court terme centrée
                            auparavant sur les évacuations</span
                        >
                        dans l’objectif de
                        <span class="font-bold"
                            >réduire durablement le nombre de personnes vivant
                            dans les bidonvilles</span
                        >. Les informations partagées sur la plateforme
                        contribuent à cet objectif.
                    </p>
                    <p class="mt-4">
                        Ainsi, les informations sur la plateforme (exemple : les
                        conditions de vie et d’environnement sur le site, le
                        nombre d’habitants, le nombre d’enfants, les champs
                        d’intervention des acteurs sur un site, etc.) vont
                        servir à :
                    </p>
                    <ul class="list-disc pl-4">
                        <li>
                            <span class="font-bold">rendre visible</span> la
                            situation des habitants
                        </li>
                        <li>
                            <span class="font-bold"
                                >renforcer le pouvoir d’agir</span
                            >
                            de chaque acteur sur le terrain
                        </li>
                        <li>
                            <span class="font-bold"
                                >préparer les plans d’actions et
                                interventions</span
                            >
                            (diagnostic social, médiation scolaire, insertion
                            par l’emploi, accès au logement, amélioration des
                            conditions de vie, médiation en santé, etc.)
                        </li>
                        <li>
                            <span class="font-bold"
                                >faciliter la coordination et le dialogue</span
                            >
                            entre les acteurs
                        </li>
                        <li>
                            <span class="font-bold"
                                >mesurer et valoriser les résultats</span
                            >
                            des actions de résorption menées sur le terrain
                        </li>
                    </ul>
                    <p class="mt-4">
                        La plateforme ne représente en aucun cas un outil pour
                        faciliter les décisions de justice par les préfets et
                        les services de police, disposant déjà de leur propre
                        outil et canal d’information pour conduire ces
                        décisions.
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem>
                <template v-slot:title
                    >Quels types de données sont partagées sur la plateforme
                    ?</template
                >
                <template v-slot:content>
                    <p>Les données partagées sur la plateforme sont :</p>
                    <ul class="list-disc pl-4">
                        <li>
                            les caractéristiques d’un site (localisation, nombre
                            d’habitants …)
                        </li>
                        <li>
                            les conditions de vie et d’environnement des
                            habitants sur le site (accès à l’eau, évacuation des
                            déchets, présence de nuisibles…)
                        </li>
                        <li>les utilisateurs (annuaire)</li>
                        <li>
                            les actions de résorption sur le terrain (actions
                            financées, médiation scolaire, champs d’intervention
                            des acteurs, constats suite visite terrain…).
                        </li>
                    </ul>
                    <p class="mt-4">
                        La plateforme
                        <span class="italic">Résorption-bidonvilles</span>
                        apporte une vision globale de la situation d’un site.
                        Aucune donnée nominative concernant les habitants ne
                        sont partagées sur la plateforme. Les administrateurs
                        locaux assurent le rôle de modérateurs des messages
                        laissés sur le journal du site et peuvent supprimer tout
                        message dévoilant des données personnelles des habitants
                        ou issues d’un bidonville (Nom, âge, sexe, origine,
                        condamnation judiciaire…). Par ailleurs, chaque
                        utilisateur signe une charte d’engagement d’utilisation
                        de la plateforme qui cadre les informations qu’il est
                        possible de partager et leurs usages.
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem>
                <template v-slot:title
                    >J’ai déjà des outils de travail : la plateforme est-t-elle
                    un doublon avec mes outils ?</template
                >
                <template v-slot:content>
                    <p>
                        Le caractère centralisé de la plateforme distingue cette
                        dernière des autres outils existants.
                        Résorption-Bidonvilles offre une vision globale et
                        synthétique d’un territoire donné. Les informations sont
                        mises au même niveau pour tous les acteurs,
                        indépendamment de leur structure et de leur fonction.
                    </p>
                    <p class="mt-4">
                        Cette centralisation des données et vision globale
                        permet :
                    </p>
                    <ul class="list-disc pl-4">
                        <li>
                            un <span class="font-bold">gain de temps</span> et
                            de <span class="font-bold">clarté</span> dans les
                            actions et la coordination entre les acteurs
                        </li>
                        <li>
                            une
                            <span class="font-bold">complémentarité</span> aux
                            outils de suivi individuels existants
                        </li>
                        <li>
                            un <span class="font-bold">meilleur suivi</span> des
                            actions et de leurs résultats
                        </li>
                        <li>
                            une meilleure
                            <span class="font-bold">visibilité en temps</span>
                            réel de la situation à l’échelle nationale
                        </li>
                    </ul>
                    <p class="mt-4">
                        Dans une volonté de faire évoluer continuellement la
                        plateforme, notre équipe se tient à votre disposition
                        pour toute suggestion d’amélioration de l’outil :
                        <a
                            href="mailto:contact@resorption-bidonvilles.beta.gouv.fr"
                            >contact@resorption-bidonvilles.beta.gouv.fr</a
                        >
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem>
                <template v-slot:title
                    >Comment demander un accès à la plateforme ?</template
                >
                <template v-slot:content>
                    <p>
                        <router-link to="/contact"
                            >Demander votre accès en 1 minute via un court
                            formulaire</router-link
                        >
                    </p>
                </template>
            </AccordionItem>
        </Accordion>
    </div>
</template>
