import Menu from './Menu.vue';
import MenuItem from './MenuItem.vue';

export default {
    title: 'Menu',
    component: Menu
};

export const DefaultMenu = () => ({
    components: { Menu, MenuItem },
    template: `
    <Menu>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
    </Menu>
    `
});

export const MenuWithoutPadding = () => ({
    components: { Menu, MenuItem },
    template: `
    <Menu variant="withoutPadding">
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
    </Menu>
    `
});
