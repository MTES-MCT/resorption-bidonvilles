<template>
    <div>
        <div class="flex justify-between items-start">
            <div>
                <div class="text-display-xl mb-2">{{ title }}</div>
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
        </div>
        <slot />
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
