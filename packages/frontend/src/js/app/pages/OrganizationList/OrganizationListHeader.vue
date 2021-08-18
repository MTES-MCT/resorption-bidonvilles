<template>
    <div>
        <div class="flex justify-between items-start">
            <div class="w-1/2 pr-16">
                <div class="text-display-lg mb-2">
                    Annuaire - <span class="text-info">{{ title }}</span>
                </div>
                <div class="flex items-center">
                    <div class="mr-4">
                        <img :src="locationImg" width="80" height="80" />
                    </div>
                    <div>
                        <div>
                            <div>{{ nbOrganizations }} structures</div>
                            <div>{{ nbUsers }} utilisateurs</div>
                            <div>
                                Les utilisateurs nationaux ont une visibilité
                                sur tous les territoires.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="min-w-128 flex-1 pl-16">
                <div class="border-b-2 mb-2 font-bold">
                    <Icon icon="info-circle" /> Information
                </div>
                <div>
                    L'annuaire répertorie tous les utilisateurs de la
                    plateforme.
                </div>
                <div>
                    <span class="text-info"
                        ><Icon icon="user-shield" /> Les administrateurs
                        locaux</span
                    >
                    ont pour rôle est d’ouvrir et de gérer les accès aux
                    utilisateurs de leur territoire. Ils sont à solliciter pour
                    toute question sur les droits d'accès et la plateforme.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        nbOrganizations: {
            type: Number
        },
        nbUsers: {
            type: Number
        },
        locationImg: {
            type: String
        }
    }
};
</script>
