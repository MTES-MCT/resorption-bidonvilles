<template>
    <div class="leftContainer">
        <h1 class="text-display-md mb-4">
            Tableau de bord
        </h1>

        <div>
            <div>
                <LeftColumnLink :to="`/statistiques/`">France</LeftColumnLink>
            </div>
            <div v-for="option in departements" :key="option.code">
                <LeftColumnLink :to="`/statistiques/${option.code}`"
                    >{{ option.code }} - {{ option.name }}</LeftColumnLink
                >
            </div>
        </div>
    </div>
</template>

<script>
import LeftColumnLink from "#app/pages/PrivateStats/LeftColumnLink";
export default {
    components: { LeftColumnLink },
    props: {
        departements: {
            type: Array
        }
    }
};
</script>

<style>
.leftContainer {
    position: sticky;
    top: 48px;
    height: calc(100vh - 100px);
    overflow-y: scroll;
}
</style>
