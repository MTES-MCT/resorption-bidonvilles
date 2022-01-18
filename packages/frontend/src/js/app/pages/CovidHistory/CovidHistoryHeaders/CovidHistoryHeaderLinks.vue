<template>
    <div class="flex flex-row-reverse sm:flew-row">
        <div class="ml-2">
            <router-link to="/fiches-hebergement-logement-adapte" class="link">
                <font-awesome-icon icon="file-pdf"></font-awesome-icon>
                &nbsp;Fiches hébergement et logement adapté</router-link
            >
        </div>
        <div class="ml-2">
            <router-link to="/fiche-bidonvilles-maraudes" class="link">
                <font-awesome-icon icon="file-pdf"></font-awesome-icon>
                &nbsp;Fiche bidonvilles et maraudes</router-link
            >
        </div>
        <div>
            <router-link
                to="/covid-19-recommandations-vaccination"
                class="link"
            >
                <font-awesome-icon icon="file-pdf"></font-awesome-icon>
                &nbsp;Recommandations vaccination personnes en situation de
                grande précarité</router-link
            >
        </div>
    </div>
</template>
