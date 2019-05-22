import Vue from 'vue';
import axios from 'axios';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'vue-easytable/libs/themes-base/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VTable, VPagination } from 'vue-easytable';

import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';

import App from './App';
import router from './router';
import store from './store';

import db from './db';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.use(ElementUI);
Vue.use(VXETable);

Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);

Vue.http = Vue.prototype.$http = axios;
Vue.db = Vue.prototype.$db = db;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
