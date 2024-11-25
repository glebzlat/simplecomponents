import { createApp } from 'vue';
import App from './App.vue';

import './assets/main.css';

import ClickOutside from './ClickOutside';

const app = createApp(App);
app.directive('click-outside', ClickOutside);
app.mount('#app');
