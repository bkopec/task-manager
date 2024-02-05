import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Cookies from 'universal-cookie';

const user = {}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: { user },
      beforeEnter: (to, from, next) => {
        console.log(user);
        const cookies = new Cookies();
        console.log(cookies.get('jwt-token'));
        if (cookies.get('jwt-token') || user.token != undefined) {
          if (user.token == undefined) {
            user.token = cookies.get('jwt-token');
            user.login = cookies.get('login');
          }
          next();
        } else {
          next('/auth'); 
        }
      },
    },
    {
      path: '/auth',
      name: 'auth',

      component: () => import('../views/Auth.vue'),
      props: { user },

      beforeEnter: (to, from, next) => {
        console.log(user);
        const cookies = new Cookies();
        console.log(cookies.get('jwt-token'));
        if (cookies.get('jwt-token') || user.token != undefined) {
          next('/');
        } else {
          next();
        }
    },

    }
  ]
})

export default router
