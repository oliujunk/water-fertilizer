import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/components/Login';
import NavMenu from '@/components/NavMenu';
import Home from '@/components/Home';
import AutoControl from '@/components/AutoControl';
import Setting from '@/components/Setting';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'navMenu',
      redirect: '/home',
      component: NavMenu,
      children: [
        { path: '/home', component: Home },
        { path: '/autoControl', component: AutoControl },
        { path: '/setting', component: Setting },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = sessionStorage.getItem('user');
  if (to.path === '/login') {
    if (user) {
      next({ path: '/' });
    } else {
      next();
    }
  } else if (!user) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
