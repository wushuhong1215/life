<template>
	<div class="topBarSec">
		<i @click="toReturn" class="fa fa-angle-left arrow-left"></i>{{title}}
		<slot name="coupon"></slot>
		<slot name='newAddress'></slot>
		<slot name='detail'></slot>
	</div>
</template>
<script>
	export default {
		name: 'topBarSec',
		props: [
			"title", // 标题
		],
		methods: {
			toReturn() {
				if(this.title == '账号管理' || this.title == '地址管理' || this.title == '我的订单') {
					this.$router.push({
						path: '/my'
					});
				} else {
					this.$router.go(-1); // 返回上一层
				}
				window.eventBus.$emit("toReturn");
			},
		},
	}
</script>
<style lang="less">
	.topBarSec {
		height: 1.215rem;
		width: 100%;
		text-align: center;
		color: #fff;
		line-height: 1.215rem;
		font-size: 20px;
		position: relative;
		background: linear-gradient(135deg, rgba(49, 172, 255, 1) 0%, rgba(22, 205, 255, 1) 100%, rgba(44, 206, 254, 1) 100%);
		.arrow-left {
			display: inline-block;
			font-size: 30px;
			line-height: 1.215rem;
			position: absolute;
			left: 9px;
		}
	}
</style>