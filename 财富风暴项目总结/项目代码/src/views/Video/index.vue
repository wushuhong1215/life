<template>
	<div class="video">
		<topbar :source='searchSource'></topbar>
		<div class="topBarBack"></div>
		<p class="moreType" @click="toChannel"><img src="../../assets/imgs/pick@2x.png" /></p>
		<van-tabs v-model="active" @change="navChange" swipeable :swipe-threshold='threshold' :immediate-check='isCheck' line-height='0' line-width='0' title-inactive-color='#BAE7FF' title-active-color='#fff'>
			<van-tab v-for="item in navList" :title="item.videoTypeName">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if='contentShow'>
					<ul class="video-content-box">
						<li class="video-content-wrap" v-for="(item,i) in videoList" :key="i">
							<router-link :to="{path:'/videoDetail',query: {videoId: item.videoId}}">
								<div class="video-box">
									<img :src="item.videoCoverUrl" />
									<div class="video-time">{{item.videoDuration}}</div>
								</div>
								<div class="video-detail">
									<p>{{item.videoTitle}}</p>
									<p>{{item.videoSource}}</p>
								</div>
							</router-link>
						</li>
					</ul>
				</van-list>
			</van-tab>
		</van-tabs>
		<nocontent :isShow='noContentShow'></nocontent>
		<bottom-bar></bottom-bar>
	</div>
</template>
<script>
	import topBar from '../../components/topBar/index.vue'
	import bottomBar from '../../components/bottomBar/index.vue'
	import noInternet from '../../components/defaultPage/noInternet.vue'
	import noContent from '../../components/defaultPage/noContent.vue'
	import { apiVideoTypes, apiVideoCate } from '../../request/api.js';
	export default {
		components: {
			bottomBar,
			topbar: topBar,
			nointernet: noInternet,
			nocontent: noContent,
		},
		data() {
			return {
				active: 0, // 标签选中项
				threshold: 5, // 标签阀值
				pageIndex: 1, // 页数
				pageSize: 10, // 分页大小
				videoCate: '', // 视频类别
				navList: [], // 视频导航列表
				videoList: [], // 视频列表
				loading: true, // 上拉加载更多
				finished: false, // 上拉加载更多
				isCheck: false, // 首页加载
				noInternetShow: false, // 没有网络状态显示情况
				contentShow: true, // 内容显示情况
				noContentShow: false, // 没有内容显示情况
				searchSource: 0, // 搜索active
			}
		},
		activated() {
			this.init();
		},
		created() {

			var _this = this;
			apiVideoTypes({}).then(res => {
				if(res.code == 0) {
					_this.navList = res.data;
					_this.videoCate = res.data[0].videoTypeName;
					_this.videoList = [];
				} else {
					_this.$layer.msg(res.message)
				}
			});
			this.onLoad();
		},
		methods: {
			init() { // 资讯频道返回初始化
				if(this.$route.query.source == 'channel') {
					this.active = Number(this.$route.query.active);
					this.initConfig();
				}
			},
			onLoad() {
				setTimeout(() => {
					this.getDatas({
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						videoCate: this.videoCate,
					});
				}, 1000);
			},
			toChannel() { // 选择频道
				this.$router.push({
					path: '/videoChannel'
				});
			},
			initConfig() {
				this.videoList = [];
				this.pageIndex = 1;
				this.loading = true;
				this.finished = false;
				this.noContentShow = false;
				this.contentShow = true;
				this.onLoad();

			},
			navChange: function(name, title) { // 导航点击
				this.videoCate = title;
				this.initConfig();
			},
			getDatas: function(datas) { // 获取列表
				var _this = this;
				apiVideoCate(datas).then(res => {
					if(res.code == 0) {
						if(res.data.list) {
							_this.loading = false;
							_this.noContentShow = false;
							_this.contentShow = true;
							_this.pageIndex++;
							for(let i = 0; i < res.data.list.length; i++) {
								_this.videoList.push(res.data.list[i]);
							}
							if(res.data.lastPage) { // 加载最后一页
								_this.finished = true;
							}
						} else {
							if(!_this.videoList.length) {
								_this.noContentShow = true;
								_this.contentShow = false;
							}
						}

					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
		},
	}
</script>

<style lang="less">
	.video {
		.topBarBack {
			width: 100%;
			height: 2rem;
			background: linear-gradient(135deg, #31acff 0%, #16cdff 100%, #2ccefe 100%);
			position: fixed;
			top: 0;
			z-index: 3;
		}
		.moreType {
			width: 15%;
			position: fixed;
			top: 1rem;
			right: 0;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
			z-index: 99;
			img {
				float: right;
				width: 0.6rem;
				padding-top: 0.2rem;
				margin-right: 0.27rem;
			}
		}
		.moreType:before {
			content: '';
			border-left: 1px solid rgb(186, 231, 255);
			width: 1px;
			height: 50%;
			background: red;
			position: absolute;
			left: 10px;
			top: 20%;
		}
		.topNav {
			position: fixed;
			top: 1.333rem;
			z-index: 9;
			width: 100%;
			height: 0.8rem;
			.navList {
				width: 90%;
				height: 1.2rem;
				background: red;
				overflow: hidden;
				overflow-x: scroll;
				white-space: nowrap;
				li {
					width: 50px;
					text-align: center;
					float: left;
				}
			}
		}
		.van-hairline--top-bottom::after {
			border-width: 0;
		}
		.van-tabs--line .van-tabs__wrap {
			position: fixed;
			top: 1rem;
			width: 86%;
			height: 1rem;
		}
		.van-tabs__nav {
			background: none;
		}
		.van-tabs--line {
			padding-top: 2rem;
			padding-bottom: 1.5rem;
		}
		.van-tab--active {
			font-weight: 500;
			font-size: 18px;
		}
	}
	
	.van-tab {
		height: 1rem;
		line-height: 1rem;
	}
</style>