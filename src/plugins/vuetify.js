// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import Vuetify CSS styles
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Optional icon set


export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light', // You can change the default theme here
  },
  icons: {
    defaultSet: 'mdi', // Set default icon set
    aliases,
    sets: { mdi }, // Register MDI icon set
  },
});
