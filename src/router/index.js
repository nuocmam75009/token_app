// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import AboutUsPage from '@/components/AboutUsPage.vue';
import ContactUsPage from '@/components/ContactUsPage.vue';
import ResourcesPage from '@/components/ResourcesPage.vue';
import HomePage from '@/components/HomePage.vue';
import QuizzPage from '@/components/QuizzPage.vue';
import UserDashboardPage from '@/components/UserDashboardPage.vue';
import GamePage from '@/components/GamePage.vue';

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
    path: '/resources',
    name: 'Resources',
    component: ResourcesPage,
  },
  {
    path: '/homepage',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/start',
    name: 'Start',
    component: QuizzPage,
  },
  {
    path: '/userdashboard',
    name: 'UserDashboard',
    component: UserDashboardPage,
  },
  {
    path: '/game/:mode',
    name: 'Game',
    component: GamePage,
    props: true,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
