import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/index.js'
import moment from 'moment'
import animate from 'animate.css'
import 'font-awesome/css/font-awesome.min.css'
import iView from 'iview'; // iview组件
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui' // element组件
import 'element-ui/lib/theme-default/index.css'
import { Area, Dialog, Picker, Tab, Tabs, List, Toast } from 'vant'; // vant组件
import layer from 'vue-layer' // layer组件
import 'vue-layer/lib/vue-layer.css';
Vue.prototype.$layer = layer(Vue, {
	msgtime: 1.5
});
import JsEncrypt from './assets/js/rsa.js' // rsa加密
Vue.prototype.$jsEncrypt = JsEncrypt
import VueLazyload from 'vue-lazyload' // 懒加载组件
Vue.use(VueLazyload, {
	error: '/src/assets/imgs/imgerror.jpg',
	loading: '/src/assets/imgs/imgloading.gif',
	preLoad: 1,
	attempt: 1
});
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard)
Vue.use(animate);
Vue.use(Area).use(Dialog).use(Picker).use(Tab).use(Tabs).use(List);
Vue.use(iView).use(ElementUI).use(moment);
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})