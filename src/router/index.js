// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
