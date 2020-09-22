import Button from './primitives/Button.vue';
import TextInput from './primitives/input/TextInput.vue';
import Icon from './primitives/Icon.vue';
import Checkbox from './primitives/input/Checkbox.vue';
import Radio from './primitives/input/Radio.vue';
import Select from './primitives/input/Select.vue';
import SelectOption from './primitives/input/SelectOption.vue';
import FormGroup from './primitives/input/FormGroup.vue';
import Menu from './Menu/Menu.vue';
import MenuItem from './Menu/MenuItem.vue';

export default function (vueInstance) {
    vueInstance.component(
        'Button',
        Button,
    );
    vueInstance.component(
        'TextInput',
        TextInput,
    );
    vueInstance.component(
        'Icon',
        Icon,
    );
    vueInstance.component(
        'Menu',
        Menu,
    );
    vueInstance.component(
        'MenuItem',
        MenuItem,
    );
    vueInstance.component(
        'Checkbox',
        Checkbox,
    );
    vueInstance.component(
        'Radio',
        Radio,
    );
    vueInstance.component(
        'Select',
        Select,
    );
    vueInstance.component(
        'SelectOption',
        SelectOption,
    );
    vueInstance.component(
        'FormGroup',
        FormGroup,
    );
}
