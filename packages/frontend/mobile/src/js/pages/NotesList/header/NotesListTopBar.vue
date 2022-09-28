<template>
    <Container>
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-lg">Liste de vos notes</h1>
            <div>
                <Button
                    size="sm"
                    icon="filter"
                    iconPosition="left"
                    variant="primaryText"
                    @click.native="$emit('toggle')"
                    >Filtrer</Button
                >
                <Button
                    size="sm"
                    icon="plus"
                    iconPosition="left"
                    variant="primaryText"
                    @click.native="$emit('create')"
                    >Créer</Button
                >
            </div>
        </div>
    </Container>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import { Button } from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        Button
    }
};
</script>
