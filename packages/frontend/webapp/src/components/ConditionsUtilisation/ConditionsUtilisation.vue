<template>
    <article>
        <h1 class="fr-h1">
            Conditions générales d'utilisation de la plateforme
            <em>Résorption-bidonvilles</em>
        </h1>
        <p class="fr-text--sm">
            Mise à jour : <time datetime="2026-11">novembre 2026</time>
        </p>

        <DsfrSummary title="Sommaire" :anchors="anchors" class="fr-mb-4w" />

        <h2 id="presentation-du-service" class="fr-h3 fr-mb-2w">
            Présentation du service
        </h2>
        <p>
            <em>Résorption-bidonvilles</em> est un service numérique de la
            <a
                href="https://www.dihal.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
                title="Délégation interministérielle à l'hébergement et à l'accès au logement - nouvelle fenêtre"
                >Délégation interministérielle à l'hébergement et à l'accès au
                logement</a
            >
            (Dihal).
        </p>
        <p>
            Il s'agit d'une plateforme de partage d'informations (localisation
            et situation des bidonvilles, type et lieux d'actions menées par
            site, acteurs concernés) entre les différentes parties prenantes
            (préfectures, DDETS, collectivités territoriales et opérateurs le
            cas échéant) afin de favoriser la mise en place d'un accompagnement
            adapté. Le partage des informations mises à jour permet :
        </p>
        <ul>
            <li>
                d'identifier quel acteur agit aujourd'hui sur quel bidonville et
                de quelle manière, afin d'améliorer la pertinence et le ciblage
                des actions à mener par chacun ;
            </li>
            <li>
                d'avoir une vision consolidée des bidonvilles ne faisant l'objet
                d'aucune intervention aujourd'hui, et pour lesquels des actions
                doivent donc être engagées ;
            </li>
            <li>
                d'essaimer les actions qui fonctionnent sur d'autres
                territoires.
            </li>
        </ul>
        <p>
            La vision à long terme du projet est de permettre de mobiliser
            l'ensemble des acteurs susceptibles d'intervenir sur le sujet.
        </p>
        <p>
            Ce service est destiné aux services de l'État et, le cas échéant,
            aux collectivités territoriales et associations impliquées sur le
            sujet.
        </p>
        <p>
            Le présent document a pour objet de régler les relations entre les
            différents intervenants sur le service. Il définit les conditions et
            modalités d'utilisation du service
            <a
                :href="WWW_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="www.resorption-bidonvilles.dihal.gouv.fr - nouvelle fenêtre"
                >www.resorption-bidonvilles.dihal.gouv.fr</a
            >
            sur Internet.
        </p>
        <p>
            Le service est développé et opéré par la Fabrique numérique du
            ministère de la transition écologique et du ministère de la cohésion
            des territoires et des relations avec les collectivités
            territoriales, avec l'appui de l'incubateur de services numériques
            (beta.gouv.fr) de la
            <a
                href="https://www.numerique.gouv.fr/dinum/"
                target="_blank"
                rel="noopener noreferrer"
                title="direction interministérielle du numérique - nouvelle fenêtre"
                >direction interministérielle du numérique</a
            >
            (DINUM).
        </p>
        <p>L'utilisation du service est libre, facultative et gratuite.</p>
        <p>
            Toute utilisation du service est subordonnée à l'acceptation
            préalable et au respect intégral des présentes conditions générales
            d'utilisation (CGU) par l'utilisateur.
        </p>
        <p><strong>Vocabulaire :</strong></p>
        <dl>
            <dt>«&nbsp;Nous&nbsp;»</dt>
            <dd>se réfère à l'éditeur du service.</dd>
            <dt>«&nbsp;Vous&nbsp;»</dt>
            <dd>se réfère à un utilisateur du service.</dd>
            <dt>«&nbsp;Le service&nbsp;»</dt>
            <dd>
                se réfère indistinctement à l'application web et à l'interface
                de programmation applicative (API).
            </dd>
        </dl>

        <h2 id="objet" class="fr-h3 fr-mt-6w fr-mb-2w">Objet</h2>
        <p>
            Le service est composé d'une application web qui vous permet de
            recenser et suivre les sites existants et fermés (bidonvilles), de
            suivre les actions d'insertion menées ainsi que les informations sur
            les interventions des opérateurs.
        </p>

        <h2 id="qualite-des-donnees" class="fr-h3 fr-mt-6w fr-mb-2w">
            Qualité des données publiées
        </h2>
        <p>
            Nous publions sur <em>Résorption-bidonvilles</em> des données
            publiques à titre informatif. Seules les publications légales font
            foi, notamment au Journal officiel de la République française ou aux
            recueils des actes administratifs des préfectures.
        </p>
        <p>
            Par conséquent, les informations publiées sur
            <em>Résorption-bidonvilles</em> ne sauraient engager la
            responsabilité de leur éditeur ou d'un quelconque service de l'État,
            l'utilisateur y ayant recours en ayant conscience des potentielles
            erreurs ou omissions qu'elles peuvent comporter.
        </p>
        <p>
            Nous nous efforçons de livrer des données de la meilleure qualité
            possible. Toutefois, malgré toute notre attention, elles peuvent
            encore comporter des erreurs ou omissions. Si vous constatez une
            erreur ou omission parmi ces données, nous vous invitons à nous la
            signaler par courriel à
            <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a
            >.
        </p>

        <h2 id="propriete-intellectuelle" class="fr-h3 fr-mt-6w fr-mb-2w">
            Propriété intellectuelle
        </h2>
        <p>
            Ce site est la propriété exclusive du ministère de la transition
            écologique et du ministère de la cohésion des territoires et des
            relations avec les collectivités territoriales. Toute reproduction
            ou représentation totale ou partielle de ce site par quelque procédé
            que ce soit, sans l'autorisation expresse de son propriétaire, est
            interdite et constituerait une contrefaçon sanctionnée par les
            articles L. 335-2 du Code de la propriété intellectuelle.
        </p>
        <p>
            Si vous souhaitez reproduire ou réutiliser des contenus présents sur
            ce site, veuillez contacter le webmestre à l'adresse
            <a href="mailto:support-resorption-bidonvilles@dihal.gouv.fr"
                >support-resorption-bidonvilles@dihal.gouv.fr</a
            >
            pour connaître les conditions de réutilisation applicables.
        </p>
        <p>
            Les marques dont est titulaire le ministère de la transition
            écologique et le ministère de la cohésion des territoires et des
            relations avec les collectivités territoriales, ainsi que leurs
            logos figurant sur le site, sont des marques régulièrement déposées
            auprès de l'Institut national de la propriété industrielle (INPI).
            Toute reproduction totale ou partielle de ces marques ou de ces
            logos effectuée à partir des éléments du site sans l'autorisation
            expresse du propriétaire de ce site est prohibée au sens des
            articles L. 713-2 et suivants du Code de la propriété
            intellectuelle. Tout contrefacteur s'expose aux sanctions prévues
            aux articles L. 716-1 et suivants du Code de la propriété
            intellectuelle.
        </p>
        <p>
            Les bases de données figurant, le cas échéant, sur ce site Internet
            sont reproductibles, copiables, adaptables et communicables sous
            réserve de mentionner la paternité de celles-ci et la date de
            dernière mise à jour de l'information utilisée.
        </p>

        <h3
            id="donnees-administratives-publiques"
            class="fr-h5 fr-mt-4w fr-mb-2w"
        >
            Données administratives publiques
        </h3>
        <p>
            Les informations publiques délivrées par le service le sont sous
            licence ouverte v2.0. Vous êtes donc libres de réutiliser ces
            informations sous réserve de mentionner la paternité de
            l'information et la date de dernière mise à jour de l'information
            utilisée.
        </p>

        <h3 id="secret-des-affaires" class="fr-h5 fr-mt-4w fr-mb-2w">
            Données relevant du secret des affaires
        </h3>
        <p>
            Les données et informations relevant du secret des affaires ne
            relèvent pas du régime applicable à la licence ouverte v2.0.
        </p>
        <p>
            Nous nous engageons à prendre toutes les mesures nécessaires pour
            garantir la sécurité et la confidentialité des informations que vous
            nous fournissez dans le cadre du signalement d'erreur.
        </p>

        <h2 id="vie-privee" class="fr-h3 fr-mt-6w fr-mb-2w">Vie privée</h2>

        <h3 id="donnees-personnelles" class="fr-h5 fr-mb-2w">
            Données à caractère personnel
        </h3>
        <p>
            Nous nous engageons à ce que la collecte et le traitement de vos
            données, effectués à partir du site, soient conformes au règlement
            général sur la protection des données (RGPD) du 27 avril 2016,
            applicable depuis le 25 mai 2018, et à la loi informatique et
            libertés dans sa dernière version modifiée du 20 juin 2018.
        </p>
        <p>
            Ces dispositions fixent des règles strictes de confidentialité et de
            sécurité à toute organisation, publique et privée, dans le cadre du
            traitement des données à caractère personnel de leurs utilisateurs,
            et ce afin de protéger la vie privée de ceux-ci.
        </p>

        <h3 id="responsable-du-traitement" class="fr-h5 fr-mt-4w fr-mb-2w">
            Responsable du traitement
        </h3>
        <p>
            Le responsable du traitement de vos données à caractère personnel
            est :
        </p>
        <address>
            Délégation interministérielle à l'hébergement et à l'accès au
            logement<br />
            La Grande Arche<br />
            92055 La Défense Cedex
        </address>

        <h3 id="traitement-des-donnees" class="fr-h5 fr-mt-4w fr-mb-2w">
            Traitement des données et utilisation
        </h3>
        <p>
            Nous ne pouvons utiliser vos données à caractère personnel qu'à des
            fins à la fois légitimes et nécessaires. Cela signifie concrètement
            que nous traitons vos données à caractère personnel pour des
            finalités de :
        </p>
        <ul>
            <li>
                conservation de l'adresse électronique pour l'identification sur
                le site internet ;
            </li>
            <li>
                identification des contributeurs, pour certaines données
                identifiées ;
            </li>
            <li>
                partage de votre nom, prénom, structure et courriel avec les
                autres personnes accédant à la plateforme pour vous identifier
                en tant qu'acteur et contributeur.
            </li>
        </ul>
        <p>
            La nature des opérations réalisées sur les données est :
            alimentation de données et consultation.
        </p>
        <p>
            Les données à caractère personnel traitées sont : nom, prénom,
            structure professionnelle, courriel.
        </p>
        <p>
            Les données sont conservées pour une durée de 1 an maximum. La durée
            peut être réduite à la demande de la personne par courriel ou par
            téléphone.
        </p>

        <h3 id="outils-externes" class="fr-h5 fr-mt-4w fr-mb-2w">
            Outils externes utilisés
        </h3>
        <p>
            L'équipe de <em>Résorption-bidonvilles</em> se réserve le droit
            d'utiliser des logiciels de collection de rapports d'exceptions
            (comme Sentry), afin de permettre à nos développeurs de corriger
            tout éventuel bogue ou problème. Les erreurs techniques remontées
            font l'objet d'une anonymisation totale.
        </p>
        <p>
            Nous respectons simplement la loi, qui dit que certains outils de
            suivi d'audience, correctement configurés pour respecter la vie
            privée, sont exemptés d'autorisation préalable.
        </p>
        <p>
            Nous utilisons pour cela Matomo, un outil libre, paramétré pour être
            en conformité avec la recommandation «&nbsp;Cookies&nbsp;» de la
            CNIL. Cela signifie que les adresses IP, par exemple, sont
            anonymisées avant d'être enregistrées. Il est donc impossible
            d'associer les visites sur ce site à une personne.
        </p>
        <p>
            Les utilisateurs contribuent à enrichir les données et peuvent y
            accéder depuis la
            <router-link to="/stats">page des statistiques</router-link>.
        </p>
        <p>
            Dans le cadre de la communication entre la plateforme
            <em>Résorption-bidonvilles</em> et ses visiteurs et utilisateurs,
            les courriels envoyés aux usagers contiennent un traceur de type
            «&nbsp;pixel invisible&nbsp;» qui a pour finalité le suivi
            d'ouverture des courriels. Ce traceur est déposé par Mailjet pour le
            compte de <em>Résorption-bidonvilles</em>. Il a une fonction
            technique et ne collecte pas les données personnelles de
            l'utilisateur.
        </p>

        <h3 id="vos-droits" class="fr-h5 fr-mt-4w fr-mb-2w">Vos droits</h3>
        <p>
            Nous nous engageons à prendre les mesures techniques et
            organisationnelles appropriées afin de garantir la sécurité du
            traitement des données à caractère personnel de chacun.
        </p>
        <p>
            En application du règlement général sur la protection des données et
            de la loi informatique et libertés, vous disposez d'un droit
            d'accès, de rectification, de suppression et d'opposition, que vous
            pouvez exercer :
        </p>
        <ul>
            <li>
                par courriel :
                <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a> ;
            </li>
            <li>
                par voie postale : Délégation interministérielle à l'hébergement
                et à l'accès au logement, La Grande Arche, 92055 La Défense
                Cedex.
            </li>
        </ul>
        <p>
            Cette demande écrite est accompagnée d'une copie du titre d'identité
            avec signature du titulaire de la pièce, en précisant l'adresse à
            laquelle la réponse doit être envoyée.
        </p>
        <p>
            Le délégué à la protection des données du ministère de la transition
            écologique et solidaire peut également être contacté à l'adresse
            suivante :
            <a href="mailto:dpd.daj.sg@developpement-durable.gouv.fr"
                >dpd.daj.sg@developpement-durable.gouv.fr</a
            >.
        </p>
        <p>
            Conformément au règlement général sur la protection des données,
            vous disposez du droit d'introduire une réclamation auprès de la
            CNIL (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07). Les
            modalités de réclamation sont précisées sur le
            <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                title="site de la CNIL - nouvelle fenêtre"
                >site de la CNIL</a
            >.
        </p>

        <h3 id="droit-a-l-oubli" class="fr-h5 fr-mt-4w fr-mb-2w">
            Droit à l'oubli
        </h3>
        <p>
            Conformément au RGPD, la plateforme met en place le droit à l'oubli.
            Vos données personnelles (nom, prénom, adresse électronique,
            téléphone) sont automatiquement effacées 6 mois après la
            désactivation de votre compte.
        </p>
        <p>
            La désactivation de votre compte intervient 6 mois après votre
            dernière connexion à la plateforme.
        </p>
        <p>
            Vous pouvez également, à tout moment, demander la désactivation de
            votre compte depuis la page
            <router-link to="/mon-compte/desactiver-compte"
                >«&nbsp;Mon profil&nbsp;»</router-link
            >.
        </p>

        <h3 id="violation-de-donnees" class="fr-h5 fr-mt-4w fr-mb-2w">
            Procédure en cas de violation de données à caractère personnel
        </h3>
        <p>
            En cas de destruction, de perte, d'altération, de divulgation non
            autorisée de données à caractère personnel transmises, conservées ou
            traitées d'une autre manière, ou d'accès non autorisé à de telles
            données, de manière accidentelle ou illicite, susceptible
            d'engendrer un risque élevé pour les droits et libertés de
            l'utilisateur, nous vous informerons des faits et des mesures
            prises, dans les meilleurs délais.
        </p>
        <p>
            Nous nous assurerons également que le nécessaire soit fait quant à
            la notification de la violation en question à la CNIL dans les 72
            heures après en avoir pris connaissance, à moins que la violation ne
            présente pas un risque élevé pour vos droits et libertés.
        </p>

        <h3 id="cookies" class="fr-h5 fr-mt-4w fr-mb-2w">Cookies</h3>
        <p>
            Un cookie est un petit fichier texte qui ne permet pas
            l'identification de l'utilisateur mais qui enregistre des
            informations relatives à la navigation d'un ordinateur sur un site.
        </p>
        <p>
            Nous déposons des cookies de mesure d'audience (nombre de visites,
            pages consultées), respectant les conditions d'exemption du
            consentement de l'internaute définies par la recommandation
            «&nbsp;Cookies&nbsp;» de la Commission nationale de l'informatique
            et des libertés (CNIL), et pour optimiser l'utilisation de la
            plateforme. Cela signifie, notamment, que ces cookies ne servent
            qu'à la production de statistiques anonymes et ne permettent pas de
            suivre votre navigation sur d'autres sites.
        </p>
        <p>
            Nous déposons également des cookies de navigation, à des fins
            strictement techniques, qui ne sont pas conservés (mémorisation,
            pendant la durée de la session, des paramètres de filtrage et de
            préférence de fond cartographique). La consultation de la plateforme
            n'est pas affectée lorsque les utilisateurs utilisent des
            navigateurs désactivant les cookies.
        </p>
        <p>
            Les cookies utilisés sur <em>Résorption-bidonvilles</em> ne
            contiennent pas de données à caractère personnel mais seulement un
            numéro d'identification anonyme et des informations relatives à la
            navigation de l'ordinateur concerné sur le site. Il s'agit
            principalement de cookies de session permettant votre
            authentification et votre connexion à la plateforme ainsi que la
            mémorisation des éléments de navigation pendant une session. Ces
            cookies sont essentiels pour la navigation et l'accessibilité à la
            plateforme. Ils peuvent être supprimés ou bloqués. Toutefois, en
            pareille hypothèse, certaines fonctionnalités de la plateforme
            peuvent ne pas fonctionner comme prévu.
        </p>
        <p>
            Les adresses IP sont collectées et conservées pour une durée de six
            (6) mois.
        </p>

        <h2 id="evolution-du-service" class="fr-h3 fr-mt-6w fr-mb-2w">
            Évolution du service
        </h2>
        <p>
            Nous pouvons faire évoluer <em>Résorption-bidonvilles</em> sans
            information préalable ou préavis. Nous ajoutons régulièrement des
            données, retravaillons l'interface et modifions les formulations sur
            la base de vos retours et des évolutions réglementaires et
            législatives.
        </p>

        <h2 id="disponibilite-du-service" class="fr-h3 fr-mt-6w fr-mb-2w">
            Disponibilité du service
        </h2>
        <p>
            Nous pouvons suspendre l'accès à
            <em>Résorption-bidonvilles</em> sans information préalable ni
            préavis, notamment pour des raisons de maintenance. Nous mettons
            l'application à jour régulièrement. L'indisponibilité ne dépasse
            généralement pas une dizaine de secondes. Nous mettons
            <em>Résorption-bidonvilles</em> à disposition sans garantie sur sa
            disponibilité. Même si nous faisons en sorte que le service soit
            toujours opérationnel, cela signifie que d'éventuelles
            indisponibilités n'ouvriront pas droit à compensation financière.
        </p>
        <p>
            Nous nous réservons également le droit de bloquer, sans information
            préalable ni compensation financière, les usages mettant en péril
            l'utilisation du logiciel par d'autres usagers. Cela nous permet
            d'anticiper d'éventuelles attaques par déni de service.
        </p>

        <h2 id="evolution-des-conditions" class="fr-h3 fr-mt-6w fr-mb-2w">
            Évolution des conditions d'utilisation
        </h2>
        <p>
            Les termes des présentes conditions d'utilisation peuvent être
            modifiés ou complétés à tout moment, sans préavis, en fonction des
            modifications apportées au service, de l'évolution de la législation
            ou pour tout autre motif jugé nécessaire. Ces modifications et mises
            à jour s'imposent à l'utilisateur qui doit, en conséquence, se
            référer régulièrement à cette rubrique pour vérifier les conditions
            générales en vigueur. Nous rendons librement accessible l'historique
            de ces conditions.
        </p>
    </article>
</template>

<script setup>
import { DsfrSummary } from "@gouvminint/vue-dsfr";
import ENV from "@/helpers/env.js";

const { WWW_URL, CONTACT_EMAIL } = ENV;

const anchors = [
    { link: "#presentation-du-service", name: "Présentation du service" },
    { link: "#objet", name: "Objet" },
    { link: "#qualite-des-donnees", name: "Qualité des données publiées" },
    { link: "#propriete-intellectuelle", name: "Propriété intellectuelle" },
    {
        link: "#donnees-administratives-publiques",
        name: "Données administratives publiques",
    },
    {
        link: "#secret-des-affaires",
        name: "Données relevant du secret des affaires",
    },
    { link: "#vie-privee", name: "Vie privée" },
    { link: "#donnees-personnelles", name: "Données à caractère personnel" },
    { link: "#responsable-du-traitement", name: "Responsable du traitement" },
    {
        link: "#traitement-des-donnees",
        name: "Traitement des données et utilisation",
    },
    { link: "#outils-externes", name: "Outils externes utilisés" },
    { link: "#vos-droits", name: "Vos droits" },
    { link: "#droit-a-l-oubli", name: "Droit à l'oubli" },
    {
        link: "#violation-de-donnees",
        name: "Procédure en cas de violation de données à caractère personnel",
    },
    { link: "#cookies", name: "Cookies" },
    { link: "#evolution-du-service", name: "Évolution du service" },
    { link: "#disponibilite-du-service", name: "Disponibilité du service" },
    {
        link: "#evolution-des-conditions",
        name: "Évolution des conditions d'utilisation",
    },
];
</script>
