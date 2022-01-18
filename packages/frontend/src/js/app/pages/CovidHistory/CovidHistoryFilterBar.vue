<template>
    <div>
        Filtrer par<br />
        <CustomFilter
            title="Type d'activités"
            :options="options.activityTypes"
            v-model="activityTypes"
        />
    </div>
</template>
