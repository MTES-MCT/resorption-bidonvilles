import AutocompleteVue from "@trevoreyre/autocomplete-vue";
import {
    ValidationProvider,
    ValidationObserver,
    extend,
    localize
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import fr from "vee-validate/dist/locale/fr.json";
import en from "vee-validate/dist/locale/en";
import ro from "vee-validate/dist/locale/ro";
import bg from "vee-validate/dist/locale/bg";

import notifications from "vue-notification/dist/ssr";
import Button from "./Button.vue";
import TextInput from "./Form/input/TextInput.vue";
import TextArea from "./Form/input/TextArea.vue";
import Icon from "./Icon.vue";
import Checkbox from "./Form/input/Checkbox.vue";
import Radio from "./Form/input/Radio.vue";
import Select from "./Form/input/Select.vue";
import SelectOption from "./Form/input/SelectOption.vue";
import FormGroup from "./Form/FormGroup.vue";
import InputGroup from "./Form/InputGroup.vue";
import FormParagraph from "./Form/FormParagraph.vue";
import Menu from "./Menu/Menu.vue";
import MenuItem from "./Menu/MenuItem.vue";
import Dropdown from "./Dropdown.vue";
import NotificationsGroup from "./NotificationsGroup.vue";
import Modal from "./Modal.vue";
import Callout from "./Callout.vue";
import SidePanel from "./SidePanel.vue";
import Autocomplete from "./Autocomplete.vue";
import Spinner from "./Spinner.vue";
import CheckableGroup from "./Form/CheckableGroup.vue";
import Datepicker from "./Datepicker.vue";
import Tag from "./Tag.vue";

export default function(vueInstance) {
    vueInstance.component("Button", Button);
    vueInstance.component("TextInput", TextInput);
    vueInstance.component("TextArea", TextArea);
    vueInstance.component("Icon", Icon);
    vueInstance.component("Menu", Menu);
    vueInstance.component("MenuItem", MenuItem);
    vueInstance.component("Checkbox", Checkbox);
    vueInstance.component("Radio", Radio);
    vueInstance.component("Select", Select);
    vueInstance.component("SelectOption", SelectOption);
    vueInstance.component("FormGroup", FormGroup);
    vueInstance.component("Dropdown", Dropdown);
    vueInstance.component("Modal", Modal);
    vueInstance.component("SidePanel", SidePanel);
    vueInstance.component("CheckableGroup", CheckableGroup);
    vueInstance.component("InputGroup", InputGroup);
    vueInstance.component("FormParagraph", FormParagraph);
    vueInstance.component("Callout", Callout);
    vueInstance.component("Spinner", Spinner);
    vueInstance.component("AutocompleteV2", Autocomplete);
    vueInstance.component("DatepickerV2", Datepicker);
    vueInstance.component("Tag", Tag);

    vueInstance.use(notifications);
    vueInstance.component("NotificationsGroup", NotificationsGroup);
    vueInstance.component("ValidationProvider", ValidationProvider);

    vueInstance.component("ValidationObserver", ValidationObserver);

    vueInstance.component("AutocompleteVue", AutocompleteVue);

    // Vee Validate (Form Validation)
    localize({
        en,
        fr,
        bg,
        ro
    });

    Object.keys(rules).forEach(rule => {
        extend(rule, {
            ...rules[rule] // copies rule configuration
        });
    });

    localize("fr");
}
