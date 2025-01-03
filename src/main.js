import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App);

app.use(store); // Firestore
app.use(router); // Vue Router
app.use(vuetify); // Vuetify

app.mount('#app')

