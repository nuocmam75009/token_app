// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import AboutUsPage from '@/components/AboutUsPage.vue';
import ContactUsPage from '@/components/ContactUsPage.vue';
import OpenSourcePage from '@/components/OpenSourcePage.vue';
import ResourcesPage from '@/components/ResourcesPage.vue';

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
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/aboutus',
    name: 'AboutUs',
    component: AboutUsPage,
  },
  {
    path: '/contactus',
    name: 'ContactUs',
    component: ContactUsPage,
  },
  {
    path: '/opensource',
    name: 'OpenSource',
    component: OpenSourcePage,
  },
  {
    path: '/resources',
    name: 'Resources',
    component: ResourcesPage,
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
