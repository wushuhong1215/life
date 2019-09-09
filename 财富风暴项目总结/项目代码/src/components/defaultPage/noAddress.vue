<template>
	<div class="defaultPage" v-if='isShow'>
		<div>
			<img src="../../assets/imgs/defaultPage/noaddress.png" />
			<p>目前没有收货地址</p>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'defaultPage',
		props: ["isShow"],
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
		}
	}
</style>