import { createApp } from 'vue';
import App from './App.vue';

import './assets/main.css';

import SimpleComponents from 'simplecomponents';
import 'simplecomponents/style.css'

const app = createApp(App);
app.use(SimpleComponents);
app.mount('#app');
