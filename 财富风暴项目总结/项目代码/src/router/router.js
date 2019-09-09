import Vue from 'vue'
import Router from 'vue-router'
import my from '../views/my/index.vue'
import search from '../views/search/index.vue'
import login from '../views/login/index.vue'
import personalData from '../views/personalData/index.vue'
import account from '../views/account/index.vue'
import bindPhone from '../views/account/bindPhone/index.vue'
import modPass from '../views/account/modPass/index.vue'
import coupon from '../views/coupon/index.vue'
import couponDetail from '../views/coupon/couponDetail/index.vue'
import payCoupon from '../views/coupon/payCoupon/index.vue'
import agreement from '../views/register/agreement/index.vue'
import register from '../views/register/index.vue'
import forgetPass from '../views/forgetPass/index.vue'
import address from '../views/address/index.vue'
import newAddress from '../views/address/newAddress/index.vue'
import editAddress from '../views/address/editAddress/index.vue'
import order from '../views/order/index.vue'
import sales from '../views/sales/index.vue'
import teletext from '../views/teletext/index.vue'
import video from '../views/video/index.vue'
import teletextDetail from '../views/teletext/teletextDetail/index.vue'
import videoDetail from '../views/video/videoDetail/index.vue'
import logistics from '../views/order/logistics/index.vue'
import teletextChannel from '../views/teletext/channel/index.vue'
import videoChannel from '../views/Video/channel/index.vue'
Vue.use(Router);
window.eventBus = new Vue(); // eventBus
const routes = [{
		path: '/login',
		component: login,
		name: 'login'
	},
	{
		path: '/teletextChannel',
		component: teletextChannel,
		name: 'teletextChannel'
	},
	{
		path: '/videoChannel',
		component: videoChannel,
		name: 'videoChannel'
	},

	{
		path: '/video',
		component: video,
		name: 'video'
	},
	{
		path: '/logistics',
		component: logistics,
		name: 'logistics'
	},
	{
		path: '/teletextDetail',
		component: teletextDetail,
		name: 'teletextDetail'
	},
	{
		path: '/videoDetail',
		component: videoDetail,
		name: 'videoDetail'
	},
	{
		path: '/teletext',
		component: teletext,
		name: 'teletext'
	},
	{
		path: '/sales',
		component: sales,
		name: 'sales'
	},
	{
		path: '/register',
		component: register,
		name: 'register'
	},
	{
		path: '/forgetPass',
		component: forgetPass,
		name: 'forgetPass'
	},
	{
		path: '/address',
		component: address,
		name: 'address'
	},
	{
		path: '/newAddress',
		component: newAddress,
		name: 'newAddress'
	},
	{
		path: '/editAddress',
		component: editAddress,
		name: 'editAddress'
	},
	{
		path: '/order',
		component: order,
		name: 'order'
	},
	{
		path: '/agreement',
		component: agreement,
		name: 'agreement'
	},
	{
		path: '/coupon',
		component: coupon,
		name: 'coupon'
	},
	{
		path: '/payCoupon',
		component: payCoupon,
		name: 'payCoupon'
	},
	{
		path: '/couponDetail',
		component: couponDetail,
		name: 'couponDetail'
	},
	{
		path: '/bindPhone',
		component: bindPhone,
		name: 'bindPhone'
	},
	{
		path: '/modPass',
		component: modPass,
		name: 'modPass'
	},
	{
		path: '/account',
		component: account,
		name: 'account'
	},
	{
		path: '/personalData',
		component: personalData,
		name: 'personalData'
	},
	{
		path: '/my',
		component: my,
		name: 'my'
	},
	{
		path: '/search',
		component: search,
		name: 'search'
	},
	{
		path: '*',
		redirect: '/teletext'
	},
	{
		path: '',
		redirect: '/teletext'
	}
];

const router = new Router({
	mode: 'history',
	routes,
})
export default router