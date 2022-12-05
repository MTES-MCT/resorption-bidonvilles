<template>
    <SubQuestionWrapper label="Où se situe l'accès ?">
        <CheckableGroup withoutMargin>
            <Radio
                variant="radio"
                label="sur site ou à moins de 20 mètres"
                name="old_water_distance"
                value="0-20"
                disabled
            />
            <Radio
                variant="radio"
                label="entre 20 et 50 mètres du site"
                name="old_water_distance"
                value="20-50"
                disabled
            />
            <Radio
                variant="radio"
                label="entre 50 et 100 mètres du site"
                name="old_water_distance"
                value="50-100"
                disabled
            />
            <Radio
                variant="radio"
                label="à plus de 100 mètres du site"
                name="old_water_distance"
                value="100+"
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
