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
            <p>
                <span class="ml-4 font-bold"
                    >Vous intervenez sur ce site ?</span
                >
                <span class="ml-2">Faites le savoir à la communauté.</span
                ><br />
                <span class="ml-4 font-bold"
                    >Vous recevrez en temps réel par mail les messages du
                    <router-link class="link" to="#newComment"
                        >journal du site</router-link
                    >.</span
                >
            </p>
        </template>
    </InfoBanner>
</template>
