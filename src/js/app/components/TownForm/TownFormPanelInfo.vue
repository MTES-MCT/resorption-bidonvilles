<template>
    <div>
        <Icon icon="flag"></Icon>
        <span class="ml-2 font-bold">Qu'est-ce qu'un site ?</span>
        <div class="bg-yellow-200 text-sm px-6 py-3 mt-2 mb-10 flex">
            <p class="py-3">
                Un site est un bidonville, squat ou immeuble bâti occupé de
                manière informelle à des fins d'habitation par plusieurs
                familles ou personnes. Il se caractérise généralement par
                l'absence de services de base : eau, électricité, gestion des
                déchets. La plateforme permet de recenser tous les sites,
                quelque soit l'origine des personnes et leur nombre.
            </p>
            <span class="text-lg cursor-pointer" @click="$emit('close')"
                ><Icon icon="times"></Icon
            ></span>
        </div>
    </div>
</template>
