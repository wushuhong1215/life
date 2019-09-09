<template>
	<div class="payCoupon">
		<topbar :title="this.title"></topbar>
		<input class="couponNum" type="text" placeholder="输入礼券编码" v-model="redemptionCode" />
		<button class="addCoupon" @click="payCoupon">礼券充值</button>
	</div>
</template>

<script>
	import { apiMemberCoupon } from '../../../request/api.js'; // 导入我们的api接口
	import topBar from '../../../components/topBarSec/index.vue'
	import { Toast } from 'vant';
	export default {
		name: 'payCoupon',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '充值',
				redemptionCode: '', // 礼券编码
			}
		},
		activated() {
			this.redemptionCode = '';
		},
		methods: {
			payCoupon() {// 充值礼券
				var _this = this;
				if(!this.redemptionCode) {
					this.$layer.msg("请输入礼券卡号");
					return false;
				};
				if(!/^[0-9a-zA-Z]*$/.test(this.redemptionCode) || this.redemptionCode.length != 6){// 过滤编码条件
					this.$layer.msg("无效的编码");
					return false;
				}
				apiMemberCoupon({
					param1: _this.redemptionCode
				}).then(res => {
					if(res.code == 0) {
						Toast.success('充值成功');
						setTimeout(function() {
							Toast.clear();
							_this.$router.push({
								path: '/coupon'
							});
						}, 1800)
					} else {
						_this.$layer.msg(res.message);
					}
				})

			}
		}
	}
</script>

<style lang="less" scoped>
	.payCoupon {
		.couponNum {
			width: 9.06rem;
			border-radius: 8px;
			border: 1px solid rgba(168, 168, 168, 1);
			background: none;
			outline: none;
			height: 1.44rem;
			padding-left: 0.45rem;
			font-size: 16px;
			margin: 0.35rem auto;
			display: block;
		}
		.addCoupon {
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