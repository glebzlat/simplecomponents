import SimpleCircularIndicator from './components/SimpleCircularIndicator.vue';
import SimpleSwitch from './components/SimpleSwitch.vue';
import SimpleCheckbox from './components/SimpleCheckbox.vue';
import SimpleTooltip from './components/SimpleTooltip.vue';
import SimpleDropdown from './components/SimpleDropdown.vue';
import SimpleButton from './components/SimpleButton.vue';
import SimpleMenu from './components/SimpleMenu.vue';
import SimpleInput from './components/SimpleInput.vue';

import ClickOutside from './directives/ClickOutside';

export {
  SimpleCircularIndicator,
  SimpleSwitch,
  SimpleCheckbox,
  SimpleTooltip,
  SimpleDropdown,
  SimpleButton,
  SimpleMenu,
  ClickOutside
};

export default function install(app) {
  app
    .component('SimpleCircularIndicator', SimpleCircularIndicator)
    .component('SimpleSwitch', SimpleSwitch)
    .component('SimpleCheckbox', SimpleCheckbox)
    .component('SimpleTooltip', SimpleTooltip)
    .component('SimpleDropdown', SimpleDropdown)
    .component('SimpleButton', SimpleButton)
    .component('SimpleMenu', SimpleMenu)
    .component('SimpleInput', SimpleInput)
    .directive('click-outside', ClickOutside);
}
