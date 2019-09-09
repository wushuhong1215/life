<template>
	<div id="search">
		<!--顶部标题-->
		<div class="topBarSec">
			<div class="searchType">站内搜索</div>
			<div class="searchInput">
				<input id="searchInput" v-model="keyword" @keyup.enter="submit" v-on:input="searchInput" type="text" placeholder="请输入关键字" />
				<img v-if="deleteShow" alt="删除图标" @click="deleteKey" src="../../assets/imgs/deleteIcon.png" />
			</div>
			<i @click="toReturn" class="fa fa-angle-left arrow-left"></i>
		</div>
		<!--媒体-->
		<van-tabs v-model="active" @change="navChange" swipeable color='#1DCEFF' title-active-color='#1DCEFF' background='#fff' line-height='1px'>
			<van-tab title="媒体">
				<p class="mediaTotalCount" v-if="recordShow">共{{mediaTotalCount}}条媒体记录</p>
				<van-list v-if="contentShow1" v-model="loading1" :finished="finished1" finished-text="没有更多了" @load="onLoad1" :immediate-check='isCheck1'>
					<ul class="video-content-box">
						<li class="video-content-wrap" v-for="(item,i) in mediaList">
							<router-link :to="{path:'/teletextDetail',query: {graphicId: item.id,isFresh:true}}" :key="i" v-if="item.source == '头条' || item.source == '微信' ? true : false">
								<div class="video-box">
									<img :src="item.thumbnailUrl" />
								</div>
								<div class="video-detail">
									<p>{{item.title}}</p>
									<p><span class="fl">{{item.source}}</span><span class="rl">{{item.creatTime}}</span></p>
								</div>
							</router-link>
							<router-link :to="{path:'/videoDetail',query: {videoId: item.id,isFresh:true}}" :key="i" v-if="item.source == '优酷' ? true : false">
								<div class="video-box">
									<img :src="item.thumbnailUrl" />
									<div class="video-time">{{item.duration}}</div>
								</div>
								<div class="video-detail">
									<p>{{item.title}}</p>
									<p>{{item.source}}</p>
								</div>
							</router-link>
						</li>
					</ul>
				</van-list>
			</van-tab>
			<!--商品-->
			<van-tab title="商品">
				<p class="goodsTotalCount" v-if="recordShow">共{{goodsTotalCount}}条商品记录</p>
				<van-list v-if="contentShow2" v-model="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2" :immediate-check='isCheck2'>
					<ul class="video-content-box">
						<li class="video-content-wrap" v-for="(item,i) in goodsList" :key="i">
							<a :href="item.productUrl">
								<div class="video-box">
									<img :src="item.productMasterImg" />
									<div class="video-time">已兑{{item.productCustomSale}}</div>
								</div>
								<div class="video-detail">
									<p>{{item.productName}}</p>
									<p><strong>￥{{item.productPrice}}</strong><span v-if="item.isUseGift" style="color: #666;float: right;">可用礼券抵扣现金</span></p>
								</div>
							</a>
						</li>
					</ul>
				</van-list>
			</van-tab>
		</van-tabs>
		<nocontent :isShow="noContentShow"></nocontent>
	</div>
</template>
<script>
	import noContent from '../../components/defaultPage/noContent.vue'
	import { apiProductName, apiSearchGraphicVideos } from '../../request/api.js';
	import Vue from 'vue';
	import { Tab, Tabs, List } from 'vant';
	Vue.use(List);
	export default {
		components: {
			nocontent: noContent,
		},
		data() {
			return {
				pageIndex1: 1, // 媒体分页
				pageSize1: 10, // 媒体分页大小
				loading1: true, // 媒体上拉加载更多
				finished1: false, // 媒体上拉加载更多
				isCheck1: false, // 媒体分页首页加载
				pageIndex2: 1, // 商品分页
				pageSize2: 10, // 商品分页大小
				loading2: true, // 商品上拉加载更多
				finished2: false, // 商品上拉加载更多
				isCheck2: false, // 商品分页首页加载
				contentShow1: true, // 媒体内容显示
				contentShow2: false, // 商品内容显示
				noContentShow: false, // 没用内容显示
				recordShow: false,// 记录条数显示
				active: 0, // 标签导航
				keyword: '', // 关键字
				goodsList: [], // 商品列表
				mediaList: [], // 媒体列表
				mediaTotalCount: 0, // 媒体总数量
				goodsTotalCount: 0, // 媒体总数量
				deleteShow: false,
			}
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				this.active = this.$route.query.active;
				this.keyword = '';
				this.noContentShow = false;
				this.contentShow1 = false;
				this.contentShow2 = false;
				this.goodsList = [];
				this.mediaList = [];
				this.mediaTotalCount = 0;
				this.goodsTotalCount = 0;
				document.getElementById('searchInput').focus()
			},
			onLoad1() { // 媒体上拉加载更多
				setTimeout(() => {
					this.getDatas1({
						keyword: this.keyword,
						pageIndex: this.pageIndex1,
						pageSize: this.pageSize1,
						tag: true,
					})
				}, 1000);
			},
			onLoad2() { // 商品上拉加载更多
				setTimeout(() => {
					this.getDatas2({
						keyword: this.keyword,
						pageIndex: this.pageIndex2,
						pageSize: this.pageSize2,
					})
				}, 1000);
			},
			submit() { // 回车搜索
				if(this.keyword == ''){
					this.$layer.msg('搜索关键字不能为空');
					return false;
				};
				this.active == 0 ? this.selectMedia() : this.selectGood()
			},
			navChange() { // 标签导航
				if(this.keyword == ''){
					return false;
				};
				this.mediaTotalCount = 0;
				this.goodsTotalCount = 0;
				this.active == 0 ? this.selectMedia() : this.selectGood()
			},
			getDatas1(datas) { // 获取媒体数据
				var _this = this;
				apiSearchGraphicVideos(datas).then(res => {
					if(res.code == 0) {
						_this.mediaTotalCount = res.data.totalCount;
						if(res.data.list) {
							var list = res.data.list;
							_this.loading1 = false;
							_this.noContentShow = false;
							_this.contentShow1 = true;
							_this.recordShow = true;
							_this.pageIndex1++;
							for(let i = 0; i < list.length; i++) {
								res.data.list[i].creatTime = res.data.list[i].creatTime.split(" ")[0];
								_this.mediaList.push(res.data.list[i]);
							}
							if(res.data.lastPage) { // 加载最后一页
								_this.finished1 = true;
							}
						} else {
							if(!_this.mediaList.length) { // 列表没有内容
								_this.noContent();
							}
						}
					} else {
						_this.$layer.msg(res.message);
						_this.mediaTotalCount = 0;
						_this.noContent();
					}
				})
			},
			getDatas2(datas) { // 获取商品数据
				var _this = this;
				apiProductName(datas).then(res => {
					if(res.code == 0) {
						_this.goodsTotalCount = res.data.totalCount;
						if(res.data.list) {
							_this.loading2 = false;
							_this.noContentShow = false;
							_this.contentShow2 = true;
							_this.pageIndex2++;
							var list = res.data.list;
							for(let i = 0; i < list.length; i++) {
								list[i].productMasterImg = list[i].seller.sellerImgDomain + list[i].productMasterImg
								list[i].productUrl = list[i].seller.sellerWebDomain + "/product/" + list[i].merchantProductId + ".html?Referer=" + list[i].seller.sellerWebDomain + "/&token=" + localStorage.getItem('access_token');
								_this.goodsList.push(res.data.list[i]);
							}
							if(res.data.lastPage) { // 加载最后一页
								_this.finished2 = true;
							}
						} else {
							if(!_this.goodsList.length) { // 列表没有内容
								_this.noContent();
							}
						}
					} else {
						_this.$layer.msg(res.message);
						_this.goodsTotalCount = 0;
						_this.noContent();
					}
				})
			},
			searchInput() {
				if(!this.keyword == '') {
					if(this.keyword || this.keyword == 0) {
						this.deleteShow = true;
					} else {
						this.deleteShow = false;
					}
				} else {
					this.deleteShow = false;
				}
			},
			deleteKey() { // 删除关键字
				this.keyword = '';
				this.deleteShow = false;
			},
			toReturn() { //返回上一层
				this.$router.go(-1);
			},
			noContent() {
				this.contentShow1 = false;
				this.contentShow2 = false;
				this.noContentShow = true;
			},
			selectMedia() {
				this.mediaList = [];
				this.pageIndex1 = 1;
				this.loading1 = true;
				this.finished1 = false;
				this.noContentShow = false;
				this.contentShow1 = true;
				this.onLoad1();
			},
			selectGood() {
				this.goodsList = [];
				this.pageIndex2 = 1;
				this.loading2 = true;
				this.finished2 = false;
				this.noContentShow = false;
				this.contentShow2 = true;
				this.onLoad2();
			},
		},
	}
</script>
<style lang="less">
	#search {
		.videoImg {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			background-size: cover;
			background-repeat: no-repeat;
		}
		.mediaTotalCount,
		.goodsTotalCount {
			padding: 10px;
			padding-left: 13px;
			font-size: 15px;
		}
		.topBarSec {
			height: 1.215rem;
			width: 100%;
			text-align: center;
			color: #fff;
			line-height: 1.215rem;
			font-size: 20px;
			position: relative;
			background: linear-gradient(135deg, rgba(49, 172, 255, 1) 0%, rgba(22, 205, 255, 1) 100%, rgba(44, 206, 254, 1) 100%);
			.searchType {
				height: 0.69rem;
				width: 2.18rem;
				line-height: 0.69rem;
				text-align: center;
				color: #FFF;
				font-size: 15px;
				background: #1DCEFF;
				border-radius: 30px;
				margin-left: 54px;
				float: left;
				margin-top: 0.2625rem;
			}
			.searchInput {
				height: 0.69rem;
				width: 3.81rem;
				font-size: 15px;
				line-height: 0.69rem;
				border-radius: 30px;
				padding-left: 10px;
				color: #000000;
				float: left;
				margin-top: 0.2625rem;
				background: #fff;
				margin-left: 0.43rem;
				input {
					width: 70%;
					outline: none;
					border: none;
					float: left;
					color: #999999;
					border-radius: 10px;
				}
				img {
					height: 0.48rem;
					width: 0.48rem;
					margin-top: 0.105rem;
				}
			}
			.searchCnt {
				overflow: hidden;
				input {
					float: left;
					height: 0.69rem;
					width: 3.81rem;
				}
			}
			.arrow-left {
				display: inline-block;
				font-size: 30px;
				line-height: 1.215rem;
				position: absolute;
				left: 9px;
			}
		}
	}
	
	input::input-placeholder {
		color: #ccc!important;
	}
	/* 有些资料显示需要写，有些显示不需要，但是在编辑器webstorm中该属性不被识别 */
	
	::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #ccc!important;
	}
	
	:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		color: #ccc!important;
	}
	
	::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: #ccc!important;
	}
	
	:-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: #ccc!important;
	}
</style>