<template>
    <SubQuestionWrapper
        label="L'accès est-il continu ? C'est-à-dire qu'il ne varie pas en qualité et en quantité dans la journée et les saisons, sans limite dans le temps."
    >
        <CheckableGroup direction="horizontal" withoutMargin>
            <Radio
                variant="radio"
                label="Oui"
                name="old_water_continuousAccess"
                :value="true"
                disabled
            />
            <Radio
                variant="radio"
                label="Non"
                name="old_water_continuousAccess"
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
