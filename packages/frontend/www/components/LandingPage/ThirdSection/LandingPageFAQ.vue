<template>
    <div>
        <h2 class="text-display-lg font-bold">FAQ : questions fréquentes</h2>
        <Accordion class="ml-16 mt-6">
            <AccordionItem id="1">
                <template v-slot:title>Qui a accès à la plateforme ?</template>
                <template v-slot:content>
                    <p>
                        L’accès à la plateforme est
                        <span class="font-bold">ouvert aux acteurs de la résorption,</span>
                        c’est-à-dire :
                    </p>
                    <ul class="mt-6 list-disc">
                        <li>les acteurs publics impliqués dans le pilotage et les
                            actions dans les territoires (en matière d’éducation,
                            santé, emploi et logement, agents de l’État, des
                            collectivités territoriales…)</li>
                        <li>les acteurs de terrain qui interviennent auprès des
                            habitants (associations, opérateurs, collectifs)</li>
                        <li>les acteurs nationaux chargés du suivi et de la mise
                            en œuvre de cette politique publique (Dihal, Ministères,
                            associations nationales…)</li>
                    </ul>
                    <p class="mt-6">
                        Les accès sont ouverts en fonction du territoire
                        d’intervention de l’utilisateur. cf. question suivante
                        pour plus de détails.
                    </p>
                    <p class="mt-6">
                        <span class="font-bold italic">Le saviez-vous ?</span>
                        L’annuaire de la plateforme est ouvert à tous. Il permet
                        de connaître tous les utilisateurs présents sur la
                        plateforme et favorise également la mise en réseau des
                        partenaires locaux ou des pairs.
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem id="2">
                <template v-slot:title>Qui peut faire quoi ? Qui peut voir les données que je
                    partage ?
                </template>
                <template v-slot:content>
                    <p>
                        Les accès à la plateforme se font en fonction du
                        territoire de l’utilisateur. Ainsi, un utilisateur
                        enregistré comme intervenant en Seine-et-Marne ne pourra
                        pas voir les données partagées au sujet des sites
                        présents en Essonne. Seuls les utilisateurs enregistrés
                        au niveau national (dans les ministères, au sein des
                        administrations centrales ou des partenaires associatifs
                        nationaux) peuvent consulter l’intégralité des données.
                    </p>
                    <p class="mt-6">
                        Les accès permettent de consulter les informations sur
                        les sites à l’échelle de son territoire, de signaler ses
                        interventions et de laisser un message dans le journal
                        du site. Selon le périmètre d'intervention de l'acteur,
                        l'administrateur local peut étendre ses accès et ouvrir
                        la possibilité de mettre à jour, créer ou déclarer la
                        fermeture d'un site.
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem id="3">
                <template v-slot:title>Qui valide ma demande d’accès à la plateforme ?</template>
                <template v-slot:content>
                    <p>
                        Les demandes d’accès à la plateforme sont validées par
                        <span class="font-bold">des administrateurs locaux, désignés par la
                            DIHAL</span>. Ils sont en Préfecture et/ou dans une Direction
                        départementale de l’emploi, du travail et des
                        solidarités. Ces demandes sont évaluées au cas par cas,
                        puis validées ou non en fonction du champ
                        d’intervention, du rôle et du besoin du demandeur.
                    </p>

                    <p class="mt-6">
                        <span class="font-bold">Le saviez-vous ?</span>
                        L’administrateur local de votre territoire est
                        identifiable sur l’annuaire par un picto bleu
                        <span class="text-info">
                            <Icon icon="user-shield" width="20" height="16" title="Administrateur local" />
                        </span>
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem id="4">
                <template v-slot:title>À quoi vont servir les informations renseignées sur la
                    plateforme ?</template>
                <template v-slot:content>
                    <p>
                        L’instruction du 25 janvier 2018 a donné une nouvelle
                        impulsion à la résorption des bidonvilles. Elle vise à
                        <span class="font-bold">dépasser une approche de court terme centrée
                            auparavant sur les évacuations</span>
                        dans l’objectif de
                        <span class="font-bold">réduire durablement le nombre de personnes vivant
                            dans les bidonvilles</span>. Les informations partagées sur la plateforme
                        contribuent à cet objectif.
                    </p>
                    <p class="mt-6">
                        Ainsi, les informations sur la plateforme vont servir à
                        :
                    </p>
                    <ul class="list-disc pl-4">
                        <li>
                            <span class="font-bold">rendre visible</span> la
                            situation des habitants
                        </li>
                        <li>
                            <span class="font-bold">renforcer le pouvoir d’agir</span>
                            de chaque acteur sur le terrain
                        </li>
                        <li>
                            <span class="font-bold">préparer les plans d’actions et
                                interventions</span>
                            (diagnostic social, accompagnement social, accès au
                            logement, amélioration des conditions de vie…)
                        </li>
                        <li>
                            <span class="font-bold">faciliter la coordination et le dialogue</span>
                            entre les acteurs
                        </li>
                        <li>
                            <span class="font-bold">mesurer et valoriser les résultats</span>
                            des actions de résorption menées sur le terrain
                        </li>
                    </ul>
                </template>
            </AccordionItem>

            <AccordionItem id="5">
                <template v-slot:title>Quelles données sont partagées sur la plateforme
                    ?</template>
                <template v-slot:content>
                    <p>
                        La plateforme
                        <span class="italic">Résorption-bidonvilles</span>
                        apporte une vision globale de la situation d'un site :
                    </p>
                    <ul class="list-disc pl-4">
                        <li>
                            les
                            <span class="font-bold">caractéristiques</span>
                            essentielles : localisation, nombre d’habitants…
                        </li>
                        <li>
                            les
                            <span class="font-bold">conditions de vie et d’environnement</span>
                            des habitants sur le site : accès à l’eau, accès aux
                            toilettes, accès à l’électricité, évacuation des
                            déchets, présence de nuisibles, prévention incendie
                        </li>
                        <li>
                            les
                            <span class="font-bold">actions de résorption</span>
                            sur le terrain (actions financées, médiation
                            scolaire, champs d’intervention des acteurs)
                        </li>
                        <li>
                            les
                            <span class="font-bold">intervenants</span> présents
                            sur un site
                        </li>
                        <li>
                            les
                            <span class="font-bold">constats et situation du site</span>
                            à travers le journal du site
                        </li>
                    </ul>
                    <p class="mt-6">
                        <span class="font-bold">Aucune donnée nominative</span>
                        concernant les habitants n’est partagée sur la
                        plateforme. Les administrateurs locaux assurent le rôle
                        de modérateurs des messages laissés sur le journal du
                        site et peuvent supprimer tout message dévoilant des
                        données personnelles des habitants ou issues d’un
                        bidonville (Nom, âge, sexe, origine, condamnation
                        judiciaire…).<br />
                        La charte d’engagement signée par tous les utilisateurs
                        cadre les informations qu’il est possible de partager et
                        leurs usages.
                    </p>
                    <p class="mt-6">
                        <span class="font-bold">Le saviez-vous ?</span>
                        La rubrique “Dernières activités” vous permet d’être
                        informé de toutes les activités sur votre territoire :
                        un nouveau partenaire, une modification sur un site, un
                        message sur le journal d’un site…
                    </p>
                </template>
            </AccordionItem>

            <AccordionItem id="6">
                <template v-slot:title>J’ai déjà des outils de travail : la plateforme est-t-elle
                    un doublon avec mes outils ?</template>
                <template v-slot:content>
                    <p>
                        Le caractère centralisé de la plateforme distingue cette
                        dernière des autres outils existants.
                        <span class="italic">Résorption-Bidonvilles</span> offre
                        une vision globale et synthétique d’un territoire donné
                        identique pour tous les acteurs d’un territoire,
                        indépendamment de leur structure et de leur fonction.
                    </p>
                    <p class="mt-6">
                        Cette centralisation des données et cette vision globale
                        garantissent plus d’efficacité dans la résorption car
                        elle offre :
                    </p>
                    <ul class="list-disc pl-4">
                        <li>
                            une meilleure
                            <span class="font-bold">visibilité en temps réel</span>
                            des situations
                        </li>
                        <li>
                            un <span class="font-bold">gain de temps</span> et
                            de <span class="font-bold">clarté</span> dans le
                            partage d’informations et la coordination entre les
                            acteurs
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
                    </ul>
                    <p class="mt-6">
                        Dans une volonté de faire évoluer continuellement la
                        plateforme, notre équipe se tient à votre disposition
                        pour toute suggestion d’amélioration de l’outil :
                        <a class="link"
                            href="mailto: contact-resorption-bidonvilles@dihal.gouv.fr"> contact-resorption-bidonvilles@dihal.gouv.fr</a>
                    </p>
                </template>
            </AccordionItem>
        </Accordion>
    </div>
</template>

<script setup>
import { Accordion, AccordionItem, Icon } from '@resorptionbidonvilles/ui';
</script>