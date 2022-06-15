<template>
    <div>
        <div class="flex justify-between items-start">
            <div class="w-1/2 pr-16">
                <div class="text-display-lg font-bold mb-2">
                    Découvrez notre communauté -
                    <span class="text-info">{{ title }}</span>
                </div>
                <div class="flex items-center">
                    <div class="mr-4">
                        <img :src="locationImg" width="80" height="80" />
                    </div>
                    <div>
                        <div>
                            <div>{{ nbOrganizations }} structures</div>
                            <div>{{ nbUsers }} utilisateurs</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="min-w-128 flex-1 pl-16">
                <div class="border-b-2 mb-2 font-bold">
                    <Icon icon="info-circle" /> Information
                </div>
                <div>
                    Ce pictogramme
                    <span class="text-info"><Icon icon="user-shield"/></span>
                    identifie les administrateurs locaux, qui gèrent les accès
                    des utilisateurs de leur territoire et sont sollicités pour
                    toute question sur la plate-forme.
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
