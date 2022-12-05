<template>
    <SubQuestionWrapper
        label="Est-ce que le site est accessible aux pompiers ?"
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_firePrevention_siteAccessible"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_firePrevention_siteAccessible"
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
