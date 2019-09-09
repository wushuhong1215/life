<template>
	<div class="videoDetail">
		<topbar :title="this.title"><span class="teleDetail" slot='detail' @click="toCoupon()">礼券{{couponSum}}</span></topbar>
		<div class="videoBox">
			<iframe :src="videoUrl" width="100%" height="100%" allowfullscreen="allowfullscreen" allowtransparency="true" flashvars="isAutoPlay=true"></iframe>
		</div>
	</div>
</template>

<script>
	import topBar from '../../../components/topBarSec/index.vue'
	import { apiVideo, apiCouponsum, apiUploadMemberCoupon } from '../../../request/api.js';
	export default {
		name: 'videoDetail',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '视频详情',
				videoUrl: '', // 视频地址
				couponSum: 0, // 礼券总数
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
			console.log('观看视频' + this.staySecond + 's');
			if(this.staySecond > 60 || this.staySecond == 60) {
				this.stayMinute = Math.ceil(this.staySecond / 60);
				apiUploadMemberCoupon({ // 上传礼券
					param1: this.stayMinute,
					param2: 6,
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
			init: function() { // 初始化
				var _this = this;
				if(!localStorage.getItem('access_token')) {
					this.couponSum = 0;
				} else {
					apiCouponsum({}).then(res => { // 获取礼券总额
						if(res.code == 0) {
							_this.couponSum = res.data;
						} else {
							_this.$layer.msg(res.message)
						}
					});
				}
				apiVideo({ // 获取视频连接
					param1: _this.$route.query.videoId,
					token: localStorage.getItem('access_token'),
				}).then(res => {
					if(res.code == 0) {
						_this.videoUrl = res.data.videoPlayUrl;
					} else if(res.code == 11) {
						console.log('未登录');
					} else {
						_this.$layer.msg(res.message)
					}
				});
			}
		},
	}
</script>

<style lang="less" scoped>
	html,
	body {
		width: 100%;
		height: 100%;
	}
	
	.videoDetail {
		height: 100%;
		.videoBox {
			height: 100%;
		}
		.teleDetail {
			font-size: 17px;
			position: absolute;
			right: 0.45rem;
		}
	}
</style>