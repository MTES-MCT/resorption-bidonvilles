<template>
    <InfoBanner
        icon="flag"
        :closable="true"
        buttonLabel="J'interviens sur ce site"
        @click="$emit('click')"
        @close="$emit('close')"
        class="mb-8 py-4"
    >
        <template v-slot:body>
            <span class="ml-2 font-bold">Vous intervenez sur ce site ?</span>
            <span class="ml-2">Faites le savoir à la communauté</span>
        </template>
    </InfoBanner>
</template>
