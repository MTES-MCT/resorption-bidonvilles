import Button from './Button.vue';

export default {
    title: 'Button',
    component: Button
};

export const PrimaryButton = () => ({
    components: { Button },
    template: '<Button variant="primary">Bouton primaire</Button>'
});

export const SecondaryButton = () => ({
    components: { Button },
    template: '<Button variant="secondary">Bouton secondaire</Button>'
});

export const TertiaryButton = () => ({
    components: { Button },
    template: '<Button variant="tertiary">Bouton tertiaire</Button>'
});

export const PrimaryOutlineButton = () => ({
    components: { Button },
    template: '<Button variant="primaryOutline">Bouton linéaire primaire</Button>'
});

export const PrimaryOutlineAltButton = () => ({
    components: { Button },
    template: '<Button variant="primaryOutlineAlt">Boutonlinéaire  primaire alternatif</Button>'
});

export const SecondaryOutlineButton = () => ({
    components: { Button },
    template: '<Button variant="secondaryOutline">Boutonlinéaire secondaire </Button>'
});

export const PrimaryTextButton = () => ({
    components: { Button },
    template: '<Button variant="primaryText">Bouton textuel primaire</Button>'
});

export const SecondaryTextButton = () => ({
    components: { Button },
    template: '<Button variant="secondaryText">Bouton textuel secondaire</Button>'
});

export const TextButton = () => ({
    components: { Button },
    template: '<Button variant="text">Bouton textuel simple</Button>'
});

export const FilterButton = () => ({
    components: { Button },
    template: '<Button variant="text">Bouton filtre</Button>'
});

export const BigButton = () => ({
    components: { Button },
    template: '<Button size="lg">Gros bouton</Button>'
});

export const SmallButton = () => ({
    components: { Button },
    template: '<Button size="sm">Petit bouton</Button>'
});

export const LoadingButton = () => ({
    components: { Button },
    template: '<Button :loading="true">Bouton en chargement...</Button>'
});

export const DisabledButton = () => ({
    components: { Button },
    template: '<Button :disabled="true">Bouton désactivé</Button>'
});

export const NoPaddingButton = () => ({
    components: { Button },
    template: '<Button :padding="false">Bouton sans padding</Button>'
});

export const IconButton = () => ({
    components: { Button },
    template: `
        <div>
            <Button icon="house-circle-check">Bouton avec icône à droite</Button>
            <Button icon="house-circle-check" iconPosition="left">Bouton avec icône à gauche</Button>
        </div>
    `
});