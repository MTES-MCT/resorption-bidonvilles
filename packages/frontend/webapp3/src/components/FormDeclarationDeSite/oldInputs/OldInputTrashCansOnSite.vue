<template>
    <SubQuestionWrapper
        label="Combien de poubelles / bennes sont à proximité immédiate du site (moins de 100 mètres) ?"
        withoutMargin
    >
        <TextInput
            name="old_trash_cansOnSite"
            class="w-16"
            disabled
            withoutMargin
        />
    </SubQuestionWrapper>
</template>

<script setup>
import { SubQuestionWrapper, TextInput } from "@resorptionbidonvilles/ui";
</script>
