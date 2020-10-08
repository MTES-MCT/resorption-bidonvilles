import AutocompleteVue from '@trevoreyre/autocomplete-vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/fr';

import Notifications from 'vue-notification';
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
import Autocompleter from './Autocompleter.vue';
import Datepicker from './Datepicker.vue';
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
    vueInstance.component(
        'AutocompleterV2',
        Autocompleter,
    );
    vueInstance.component(
        'DatepickerV2',
        Datepicker,
    );

    vueInstance.use(Notifications);
    vueInstance.component(
        'ValidationProvider',
        ValidationProvider,
    );

    vueInstance.component(
        'ValidationObserver',
        ValidationObserver,
    );

    vueInstance.component('AutocompleteVue', AutocompleteVue);

    // No message specified.

    Object.keys(rules).forEach((rule) => {
        extend(rule, {
            ...rules[rule], // copies rule configuration
            message: messages[rule], // assign message
        });
    });
}
