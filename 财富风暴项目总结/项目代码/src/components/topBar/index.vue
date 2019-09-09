<template>
	<div id="topBar">
		<img class="homeLogo" src="../../assets/imgs/homeLogo.png" />
		<i @click="toSearch"><img :src="sousouUrl"/></i>
	</div>
</template>

<script>
	export default {
		name: 'topBar',
		props: [
			"source", // 标题
		],
		data() {
			return {
				sousouUrl: require("../../assets/imgs/sousuo@2x.png"),
			}
		},
		methods: {
			toSearch() { // 到搜索页面
				this.$router.push({
					path: '/search',
					query: {
						active: this.source,
					}
				});
			}
		},
	}
</script>

<style lang="less">
	#topBar {
		position: fixed;
		top: 0;
		width: 100%;
		height: 1.2rem;
		z-index: 9999;
		i {
			float: right;
			margin-top: 0.3rem;
			margin-right: 0.27rem;
			img {
				height: 0.6rem;
			}
		}
		.homeLogo {
			height: 0.64rem;
			float: left;
			margin-top: 0.28rem;
			margin-left: 0.27rem;
		}
		.search {
			float: right;
			height: 0.72rem;
			color: #fff;
			font-size: 25px;
			margin-top: 10px;
			margin-right: 8px;
		}
	}
</style>