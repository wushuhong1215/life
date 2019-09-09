<template>
	<div class="defaultPage" v-if="isShow">
		<div>
			<img src="../../assets/imgs/defaultPage/nointernet.png" />
			<p>网络异常</p>
			<span @click="reload">重新加载</span>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'defaultPage',
		props: ["isShow"],
		methods:{
			reload(){
				location.reload();
			}
		},
	}
</script>
<style lang="less">
	.defaultPage {
		text-align: center;
		div {
			padding: 4rem 0;
			img {
				width: 4.3rem;
			}
			p {
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 28px;
				font-size: 20px;
				padding: 0.35rem 0;
			}
			span {
				border: 1px solid #1DCEFF;
				color: #1DCEFF;
				padding: 0.1rem 0.37rem;
				font-size: 14px;
			}
		}
	}
</style>