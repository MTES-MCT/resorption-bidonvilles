import Button from './primitives/Button.vue';
import TextInput from './primitives/input/TextInput.vue';
import TextArea from './primitives/input/TextArea.vue';
import Icon from './primitives/Icon.vue';
import Checkbox from './primitives/input/Checkbox.vue';
import Radio from './primitives/input/Radio.vue';
import Select from './primitives/input/Select.vue';
import SelectOption from './primitives/input/SelectOption.vue';
import FormGroup from './primitives/input/FormGroup.vue';
import InputGroup from './primitives/input/InputGroup.vue';
import FormParagraph from './primitives/FormParagraph.vue';
import Menu from './Menu/Menu.vue';
import MenuItem from './Menu/MenuItem.vue';
import Dropdown from './Dropdown.vue';
import Modal from './Modal.vue';
import Callout from './Callout.vue';
import SidePanel from './SidePanel.vue';
import CheckableGroup from './primitives/input/CheckableGroup.vue';


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
        'TextArea',
        TextArea,
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
    vueInstance.component(
        'Dropdown',
        Dropdown,
    );
    vueInstance.component(
        'Modal',
        Modal,
    );
    vueInstance.component(
        'SidePanel',
        SidePanel,
    );
    vueInstance.component(
        'CheckableGroup',
        CheckableGroup,
    );
    vueInstance.component(
        'InputGroup',
        InputGroup,
    );
    vueInstance.component(
        'FormParagraph',
        FormParagraph,
    );
    vueInstance.component(
        'Callout',
        Callout,
    );
}
