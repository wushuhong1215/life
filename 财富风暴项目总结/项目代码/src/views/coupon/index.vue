<template>
	<div class="coupon">
		<topbar :title="this.title"><span class="couponDetail" slot='coupon' @click="toCouponDetail">礼券明细</span></topbar>
		<div class="content">
			<img alt="礼券" src="../../assets/imgs/coupon.png" />
			<p>可用礼券<br /><strong>{{couponSum}}</strong></p>
		</div>
		<button class="payCoupon" @click="payCoupon">礼券充值</button>
	</div>
</template>

<script>
	import { apiCouponsum } from '../../request/api.js'; // 导入我们的api接口
	import topBar from '../../components/topBarSec/index.vue'
	export default {
		name: 'coupon',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '礼券中心',
				couponSum: '0', // 礼券总额
			}
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				var _this = this;
				apiCouponsum({}).then(res => {
					if(res.code == 0) {
						_this.couponSum = res.data;
					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
			payCoupon() { // 支付
				this.$router.push({
					path: '/payCoupon'
				});
			},
			toCouponDetail() { // 到礼券详情
				this.$router.push({
					path: '/couponDetail'
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.coupon {
		.couponDetail {
			font-size: 17px;
			position: absolute;
			right: 0.45rem;
		}
		.content {
			text-align: center;
			p {
				color: #999999;
				font-size: 16px;
				padding-top: 0.37rem;
				strong {
					font-size: 18px;
					color: #666666;
					padding-top: 0.32rem;
				}
			}
			img {
				margin-top: 2.02rem;
				height: 1.68rem;
				width: 1.68rem;
			}
		}
		.payCoupon {
			color: #fff;
			font-size: 16px;
			height: 1.44rem;
			background: linear-gradient(135deg, rgba(44, 207, 253, 1) 0%, rgba(22, 205, 255, 1) 100%, rgba(44, 206, 254, 1) 100%);
			border-radius: 8px;
			padding: 0;
			border: 1px solid transparent;
			outline: none;
			width: 9.06rem;
			margin: 0.45rem auto;
			display: block;
		}
	}
</style>