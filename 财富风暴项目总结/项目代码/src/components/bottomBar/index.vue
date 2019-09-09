<template>
	<div class="bottomBar">
		<van-tabbar v-model="active" active-color='#fff' inactive-color='#A5E6FF' route :z-index='zIndex'>
			<van-tabbar-item to='/teletext'>
				<span>图文</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon.active1 : icon.normal1">
			</van-tabbar-item>
			<van-tabbar-item to='/video'>
				<span>视频</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2"></van-tabbar-item>
			<van-tabbar-item to='/sales'>
				<span>换购</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon.active3 : icon.normal3"></van-tabbar-item>
			<van-tabbar-item to='/my'>
				<span>会员</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon.active4 : icon.normal4"></van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
	import Vue from 'vue';
	import { Tabbar, TabbarItem } from 'vant';
	Vue.use(Tabbar).use(TabbarItem);
	export default {
		name: 'bottomBar',
		data() {
			return {
				active: 0, // 默认选中项
				zIndex: 5, // 层级
				icon: { // 底部导航图标
					normal1: require("../../assets/imgs/bottomNav/homeed.png"),
					active1: require("../../assets/imgs/bottomNav/home.png"),
					normal2: require("../../assets/imgs/bottomNav/video.png"),
					active2: require("../../assets/imgs/bottomNav/videoed.png"),
					normal3: require("../../assets/imgs/bottomNav/shopping.png"),
					active3: require("../../assets/imgs/bottomNav/shoppinged.png"),
					normal4: require("../../assets/imgs/bottomNav/member.png"),
					active4: require("../../assets/imgs/bottomNav/membered.png"),
				}
			}
		}
	}
</script>
<style lang="less">
	.bottomBar {
		.van-tabbar {
			height: 1.5rem;
			font-size: 12px;
			background: linear-gradient(135deg, rgba(49, 172, 255, 1) 0%, rgba(22, 205, 255, 1) 100%, rgba(44, 206, 254, 1) 100%);
		}
	}
</style>