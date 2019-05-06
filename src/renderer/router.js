import Vue from 'vue';
import Router from 'vue-router';

import NavMenu from '@/components/NavMenu';
import Home from '@/components/Home';
import AutoControl from '@/components/AutoControl';
import ManualControl from '@/components/ManualControl';
import Setting from '@/components/Setting';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'toolBar',
      redirect: '/home',
      component: NavMenu,
      children: [
        { path: '/home', component: Home },
        { path: '/autoControl', component: AutoControl },
        { path: '/manualControl', component: ManualControl },
        { path: '/setting', component: Setting },
      ],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
