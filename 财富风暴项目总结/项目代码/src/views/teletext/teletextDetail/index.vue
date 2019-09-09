<template>
	<div class="teletextDetail">
		<topbar :title="this.title"><span class="teleDetail" slot='detail' @click="toCoupon"></span></topbar>
		<div class="cntBox">
			<iframe id="newsIframe" height="762" frameborder="0" width="100%" :src="articleUrl"></iframe>
		</div>
	</div>
</template>

<script>
	import topBar from '../../../components/topBarSec/index.vue'
	import { apiGraphic, apiCouponsum, apiUploadMemberCoupon } from '../../../request/api.js';
	export default {
		name: 'teletextDetail',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '',
				articleUrl: '', // 文章连接地址
				couponSum: 0, // 礼券总额
				staySecond: 0, // 停留秒数
				stayMinute: 0, // 停留分钟数
				timer: null, // 计时器
			}
		},
		activated() {
			this.staySecond = 0;
			this.timing();
			this.init();
		},
		deactivated() { // 离开页面
			clearInterval(this.timer);
			console.log('观看图文' + this.staySecond + 's');
			if(this.staySecond > 60 || this.staySecond == 60) {
				this.stayMinute = Math.ceil(this.staySecond / 60);
				apiUploadMemberCoupon({ // 上传礼券
					param1: this.stayMinute,
					param2: 2,
				}).then(res => {
					if(res.code == 0) {} else {}
				});
			}
		},
		methods: {
			toCoupon() {
				this.$router.push({
					path: '/coupon'
				});
			},
			timing() { // 计时
				var _this = this;
				this.timer = setInterval(function() {
					_this.staySecond++;
				}, 1000)
			},
			init() { // 初始化
				var _this = this;
				/*
				if(!localStorage.getItem('access_token')) {
					this.couponSum = 0;
				}
				apiCouponsum({}).then(res => { // 获取礼券总额
					if(res.code == 0) {
						_this.couponSum = res.data;
					} else {
						_this.$layer.msg(res.message)
					}
				});
				*/
				apiGraphic({ // 获取文章地址
					param1: this.$route.query.graphicId,
					token: localStorage.getItem('access_token'),
				}).then(res => {
					if(res.code == 0) {
						_this.articleUrl = res.data.graphicTmpUrl;
					} else if(res.code == 11) {
						console.log('未登录');
					} else {
						_this.$layer.msg(res.message)
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.teletextDetail {
		.teleDetail {
			font-size: 17px;
			position: absolute;
			right: 0.45rem;
		}
	}
</style>