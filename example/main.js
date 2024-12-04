import { createApp } from 'vue';
import App from './App.vue';

import './assets/main.css';

import SimpleComponents from '/src/index';

const app = createApp(App);
app.use(SimpleComponents);
app.mount('#app');
