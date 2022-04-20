import Accordion from './Accordion.vue';
import AccordionItem from './AccordionItem.vue';

export default {
    title: 'Accordion',
    component: Accordion
};

export const SimpleAccordion = () => ({
    components: { Accordion, AccordionItem },
    template: `
    <Accordion>
        <AccordionItem>
            <template v-slot:title>Je suis un item à déplier</template>
            <template v-slot:content>Avec plein de contenu à te montrer !</template>
        </AccordionItem>
        <AccordionItem>
            <template v-slot:title>Je suis un item à déplier</template>
            <template v-slot:content>Avec plein de contenu à te montrer !</template>
        </AccordionItem>
        <AccordionItem>
            <template v-slot:title>Je suis un item à déplier</template>
            <template v-slot:content>Avec plein de contenu à te montrer !</template>
        </AccordionItem>
    </Accordion>
    `
});

