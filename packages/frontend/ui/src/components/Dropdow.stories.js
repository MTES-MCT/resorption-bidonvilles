import Dropdown from './Dropdown.vue';
import Button from './Button.vue';
import Menu from './Menu/Menu.vue';
import MenuItem from './Menu/MenuItem.vue';

export default {
    title: 'Dropdown',
    component: Dropdown
};

export const SimpleDropdown = () => ({
    components: { Dropdown, Button, Menu, MenuItem },
    template: `
    <Dropdown>
        <template v-slot:button>
            <Button icon="house-circle-check">Je suis un dropdown (clique moi)</Button>
        </template>

        <template v-slot:menu>
            <Menu>
                <MenuItem>Item 1</MenuItem>
                <MenuItem>Item 2</MenuItem>
                <MenuItem>Item 3</MenuItem>
            </Menu>
        </template>
    </Dropdown>
    `
});
