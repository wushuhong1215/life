<template>
	<div class="noContent" v-if='isShow'>
		<div>
			<img src="../../assets/imgs/defaultPage/other.png" />
			<p>暂无内容</p>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'noContent',
		props: ["isShow"],
	}
</script>
<style lang="less">
	.noContent {
		text-align: center;
		div {
			padding: 1rem 0;
			img {
				width: 3.2rem;
			}
			p {
				font-weight: 500;
				color: #B2B2B2;
				line-height: 28px;
				font-size: 16px;
				padding: 0.35rem 0;
			}
		}
	}
</style>