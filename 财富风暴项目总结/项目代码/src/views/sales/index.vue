<template>
	<div class="sales">
		<topbarsales :source="searchSource"></topbarsales>
		<p class="moreType">
			<van-dropdown-menu active-color="#1DCEFF">
				<van-dropdown-item @change="sortClose" v-model="sortTypeMark" :options="options" />
			</van-dropdown-menu>
		</p>
		<van-tabs v-model="active" @change="navClick" swipeable :swipe-threshold='threshold' :immediate-check='isCheck' background='#fff' title-active-color='#1DCEFF' color='#1DCEFF' title-inactive-color='#333333' line-height='1px'>
			<van-tab v-for="item in navList" :title="item.productCateName" :name="item.productCateId">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="contentShow">
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
		<bottom-bar></bottom-bar>
	</div>
</template>
<script>
	import topBarSales from '../../components/topBarSales/index.vue';
	import bottomBar from '../../components/bottomBar/index.vue';
	import noContent from '../../components/defaultPage/noContent.vue'
	import { apiProducts, apiProductCates } from '../../request/api.js';
	import Vue from 'vue';
	import { DropdownMenu, DropdownItem } from 'vant';
	Vue.use(DropdownMenu).use(DropdownItem);
	export default {
		components: {
			bottomBar,
			topbarsales: topBarSales,
			nocontent: noContent,
		},
		data() {
			return {
				pageIndex: 1, //分页
				pageSize: 10, // 分页大小
				active: 0, // 导航默认选中
				threshold: 5, // 导航阀值
				productCateId: null, // 商品ID
				isRecommend: 2, // 是否为推荐
				noContentShow: false, // 内容显示
				contentShow: true, // 内容显示
				searchSource: 0, // 搜索来源
				navList: [{ // 导航标签
					productCateName: '推荐',
					productCateId: null
				}],
				goodsList: [], // 商品列表
				loading: true, // 上拉加载更多
				finished: false, // 上拉加载更多
				isCheck: false, // 加载首页
				sortType: 1,
				sortTypeMark: 0,
				token: null, //连接token
				options: [{ // 商品排序
						text: '默认',
						value: 0
					}, {
						text: '推荐',
						value: 1
					},
					{
						text: '新品',
						value: 2
					},
					{
						text: '价格从高到低',
						value: 3
					}, {
						text: '价格从低到高',
						value: 4
					}, {
						text: '销量从高到低',
						value: 5
					}, {
						text: '销量从低到高',
						value: 6
					}
				]
			}
		},
		activated() {
			var _this = this;
			this.token = this.getRequest().token;
			if(this.getRequest().token) {
				localStorage.setItem('access_token', this.token);
			};
			this.goodsList = [];
			this.pageIndex = 1;
			this.loading = true;
			this.finished = false;
			this.noContentShow = false;
			this.contentShow = true;
			this.onLoad();
		},
		created() {
			var _this = this;
			apiProductCates({}).then(res => { // 获取顶部导航标签
				if(res.code == 0) {
					for(let i = 0; i < res.data.length; i++) {
						_this.navList.push(res.data[i]);
					}
				} else {
					_this.$layer.msg(res.message)
				}
			})
		},
		methods: {
			onLoad() { // 上拉加载更多
				setTimeout(() => {
					this.getDatas({
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						productCateId: this.productCateId,
						sortType: this.sortType,
						isRecommend: this.isRecommend,
					});
				}, 1000);
			},
			sortClose(value) { // 关闭排序
				if(value == 0) {
					this.sortType = 1;
				}
				this.goodsList = [];
				this.pageIndex = 1;
				this.loading = true;
				this.finished = false;
				this.noContentShow = false;
				this.contentShow = true;
				this.onLoad();
			},
			navClick(name, title) { // 导航点击
				title == '推荐' ? this.isRecommend = 2 : this.isRecommend = null;
				title == '推荐' ? this.productCateId = null : this.productCateId = name;
				this.sortClose();
			},
			getDatas(datas) { // 加载列表数据
				var _this = this;
				apiProducts(datas).then(res => {
					if(res.code == 0) {
						if(res.data.list) {
							_this.loading = false;
							_this.noContentShow = false;
							_this.contentShow = true;
							_this.pageIndex++;
							var list = res.data.list;
							for(let i = 0; i < list.length; i++) {
								list[i].productMasterImg = list[i].seller.sellerImgDomain + list[i].productMasterImg
								list[i].productUrl = list[i].seller.sellerWebDomain + "/product/" + list[i].merchantProductId + ".html?Referer=" + window.preDomain + "?from=app&token=" + localStorage.getItem('access_token') + "&source=h5&customer-service-tel=" + list[i].seller.sellerPhone + "&customer-service-Qq=" + list[i].seller.sellerQq;
								//list[i].productUrl = list[i].seller.sellerWebDomain + "/product/" + list[i].merchantProductId + ".html?Referer=" + list[i].seller.sellerWebDomain + "/?from=app&token=" + localStorage.getItem('access_token') + "&source=h5&customer-service-tel=" + list[i].seller.sellerPhone + "&customer-service-Qq=" + list[i].seller.sellerQq;
								_this.goodsList.push(res.data.list[i]);
							}
							if(res.data.lastPage) { // 加载最后一页
								_this.finished = true;
							}
						} else {
							if(!_this.goodsList.length) { // 列表没有内容
								_this.noContentShow = true;
								_this.contentShow = false;
							}
						}
					} else {
						_this.noContentShow = true;
						_this.contentShow = false;
						_this.$layer.msg(res.message);
					}
				})
			},
			getRequest() {
				var url = location.search; //获取url中"?"符后的字串
				var theRequest = new Object();
				if(url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for(var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
					}
				}
				return theRequest;
			},
		}
	}
</script>
<style lang="less">
	.sales {
		.moreType {
			width: 16%;
			background: #fff;
			position: fixed;
			top: 1.2rem;
			right: 0;
			height: 44px;
			line-height: 44px;
			text-align: center;
			z-index: 99;
			overflow: hidden;
		}
		.moreType:before {
			content: '';
			border-left: 1px solid #8E8E8E;
			width: 1px;
			height: 60%;
			background: #8E8E8E;
			position: absolute;
			left: 0px;
			top: 20%;
			z-index: 9999;
		}
		.topNav {
			position: fixed;
			top: 0;
			z-index: 9;
			width: 100%;
			height: 1.2rem;
			line-height: 1.2rem;
			background: linear-gradient(135deg, #31acff 0%, #16cdff 100%, #2ccefe 100%);
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
		.van-cell__title {
			text-align: left;
		}
		.van-tabs--line .van-tabs__wrap {
			position: fixed;
			top: 1.2rem;
			border-bottom: 1px solid #D8D8D8;
			width: 84%;
			line-height: 1.17rem;
		}
		.van-tabs--line {
			padding-top: 2.4rem;
			padding-bottom: 1.2rem;
		}
		.van-dropdown-menu {
			height: 44px;
			line-height: 44px;
			border-bottom: 1px solid #D8D8D8;
		}
		.van-dropdown-menu__title {
			padding-right: 15px;
			width: 50px;
			height: 44px;
		}
		.sortClass {
			top: 45px;
			width: 46px;
		}
		.van-dropdown-menu__title::after {
			top: 14px;
			height: 10px;
			width: 10px;
			border: 2px solid #808080;
			border-top: none;
			border-right: none;
			transform: rotate(-45deg);
			right: 2px;
		}
	}
</style>