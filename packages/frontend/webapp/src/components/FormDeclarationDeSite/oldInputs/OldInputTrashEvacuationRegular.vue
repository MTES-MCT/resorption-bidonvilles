<template>
    <SubQuestionWrapper
        label="La collecte des poubelles / bennes est-elle réalisée de manière régulière ? (C'est-à-dire au moins une fois par semaine, à partir d'un point de dépôt spécialement aménagé sur le site ou à proximité immédiate)"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_trash_evacuationRegular"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_trash_evacuationRegular"
                :value="false"
                disabled
            />
        </CheckableGroup>
    </SubQuestionWrapper>
</template>

<script setup>
import {
    CheckableGroup,
    Radio,
    SubQuestionWrapper,
} from "@resorptionbidonvilles/ui";
</script>
