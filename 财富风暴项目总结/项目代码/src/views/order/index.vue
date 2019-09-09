<template>
	<div class="order">
		<topbar :title="this.title"></topbar>
		<div>
			<van-tabs v-model="active" @change="navChange" swipeable :swipe-threshold='threshold' background='#fff' title-active-color='#1DCEFF' line-height='1px' color='#1DCEFF'>
				<van-tab v-for="item in navList" :title="item.orderStateName" :name="item.orderStateId">
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" v-if='contentShow' @load="onLoad" :immediate-check='isCheck'>
						<div v-for="(item,i) in orderList" :key="i">
							<div class="orderInfo" @click="payOrderDetail(item.orderStateName,item.sellerOrderId,item.seller.sellerWebDomain)">
								<p><span class="orderNum">订单号：<span>{{item.orderNumberShow}}</span></span><span class="orderStatus">{{item.orderStateName}}</span></p>
								<div class="goodsDescribe">
									<img :src="item.productMasterImg" />
									<div class="goodsDetail">
										<p>{{item.productName}}</p>
										<p class="goodsPrice"><span>￥{{item.productMoneyPrice}}</span><span>x{{item.productNumber}}</span></p>
									</div>
								</div>
							</div>
							<div class="freight" v-if="item.moneyLogistics ? true : false">
								<p>运费<span>￥{{item.moneyLogistics}}</span></p>
							</div>
							<div class="freight">
								<p>合计<span>￥{{item.orderTotalAmount}}</span></p>
							</div>
							<div class="orderBtn">
								<div :data-id='item.orderId' @click="payOrder(item.orderNumber,item.seller.sellerWebDomain)" v-if="item.orderStateId == 1 ? true : false" class="payBtn">支付订单</div>
								<div :data-id='item.orderId' @click="cancelOrder" v-if="item.orderStateId == 1 ? true : false" class="cancelBtn">取消订单</div>
								<div :data-id='item.orderId' @click="deleteOrder" v-if="item.orderStateId == 6 || item.orderStateId == 5 ? true : false" class="cancelBtn">删除订单</div>
								<div :data-id='item.orderId' @click="confirmOrder" v-if="item.orderStateId == 4 ? true : false" class="payBtn">确认收货</div>
								<div :data-id='item.orderId' @click="viewLogistics" v-if="item.orderStateId == 4 ? true : false" class="cancelBtn">查看物流</div>
							</div>
						</div>
					</van-list>
				</van-tab>
			</van-tabs>
		</div>
		<noorder :isShow="noContentShow"></noorder>
	</div>
</template>

<script>
	import { apiOrders, apiDeleteOrder, apiReceiveOrder, apiCancelOrder } from '../../request/api.js'; // 导入我们的api接口
	import topBar from '../../components/topBarSec/index.vue';
	import noOrder from '../../components/defaultPage/noOrder.vue'
	import { Dialog, Toast } from 'vant';
	export default {
		name: 'order',
		components: {
			topbar: topBar,
			noorder: noOrder,
		},
		data() {
			return {
				title: '我的订单',
				active: 0, // 选中的标签
				threshold: 5, // 导航标签的显示个数
				navList: [{ // 导航标签栏
					orderStateName: '全部',
					orderStateId: '',
				}, {
					orderStateName: '待付款',
					orderStateId: 1,
				}, {
					orderStateName: '待发货',
					orderStateId: 3,
				}, {
					orderStateName: '待收货',
					orderStateId: 4,
				}, {
					orderStateName: '已完成',
					orderStateId: 5,
				}],
				status: 'payment', // 订单状态
				orderStateId: '', // 订单状态
				orderList: [], // 订单列表
				pageIndex: 1, // 分页
				pageSize: 10, // 分页大小
				loading: true, // 上拉加载更多
				finished: false, // 是否完成上拉加载更多
				isCheck: false, // 首页加载
				noContentShow: false, // 没有订单显示
				contentShow: true, // 正常页面
			}
		},
		activated() {
			this.active = Number(this.$route.query.active);
		},
		created() { 
			this.onLoad();
		},
		methods: {
			onLoad() { // 上拉加载更多
				setTimeout(() => {
					this.getDatas({
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						orderStateId: this.orderStateId,
					});
				}, 1000);
			},
			viewLogistics(e) { //查看物流
				this.$router.push({
					path: '/logistics',
					query: {
						orderId: Number(e.target.getAttribute('data-id'))
					},
				});
			},
			deleteOrder(e) { // 删除订单
				var _this = this;
				Dialog.confirm({
					title: '提示',
					message: '确定删除该订单？'
				}).then(() => {
					apiDeleteOrder({
						param1: Number(e.target.getAttribute('data-id'))
					}).then(res => {
						if(res.code == 0) {
							Toast.success('删除成功');
							setTimeout(function() {
								_this.initConfig();
								Toast.clear();
							}, 1800)
						} else {
							_this.$layer.msg(res.message)
						}
					})

				}).catch(() => {});
			},
			confirmOrder(e) { // 确认订单
				var _this = this;
				Dialog.confirm({
					title: '提示',
					message: '确认收货吗？'
				}).then(() => {
					apiReceiveOrder({
						param1: Number(e.target.getAttribute('data-id'))
					}).then(res => {
						if(res.code == 0) {
							Toast.success('确认成功');
							setTimeout(function() {
								_this.initConfig();
								Toast.clear();
							}, 1800)
						} else {
							_this.$layer.msg(res.message)
						}
					})
				}).catch(() => {});
			},
			cancelOrder(e) { // 取消订单
				var _this = this;
				Dialog.confirm({
					title: '提示',
					message: '确定取消该订单？'
				}).then(() => {
					apiCancelOrder({
						param1: Number(e.target.getAttribute('data-id'))
					}).then(res => {
						if(res.code == 0) {
							Toast.success('取消成功');
							setTimeout(function() {
								_this.initConfig();
								Toast.clear();
							}, 1800)
						} else {
							_this.$layer.msg(res.message)
						}
					})

				}).catch(() => {});
			},
			payOrder(e, k) { // 支付订单
				location.href = k + '/order/pay.html?relationOrderSn=' + e + '&token=' + localStorage.getItem('access_token') + '&from=app';
			},
			payOrderDetail(e, v, k) {
				location.href = k + '/member/orderdetail.html?id=' + v + '&token=' + localStorage.getItem('access_token') + '&from=app';
			},
			initConfig() {
				this.orderList = [];
				this.pageIndex = 1;
				this.loading = true;
				this.finished = false;
				this.noContentShow = false;
				this.contentShow = true;
				this.onLoad();
			},
			navChange(title, name) { // 点击导航
				this.orderStateId = title;
				if(name == "全部") this.orderStateId = '';
				this.initConfig();
			},
			getDatas(data) { // 获取订单列表数据
				var _this = this;
				apiOrders(data).then(res => {
					if(res.code == 0) {
						if(res.data.list) {
							_this.loading = false;
							_this.noContentShow = false;
							_this.contentShow = true;
							_this.pageIndex++;
							for(let i = 0; i < res.data.list.length; i++) {
								res.data.list[i].productMasterImg = res.data.list[i].seller.sellerImgDomain + res.data.list[i].productMasterImg;
								res.data.list[i].orderTotalAmount = res.data.list[i].orderTotalAmount.toFixed(2);
								//res.data.list[i].orderNumber = res.data.list[i].orderNumber;
								res.data.list[i].orderNumberShow = res.data.list[i].orderNumber.slice(0, 7) + '...' + res.data.list[i].orderNumber.slice(res.data.list[i].orderNumber.length - 7, res.data.list[i].orderNumber.length);

								_this.orderList.push(res.data.list[i]);
							}
							if(res.data.lastPage) { // 加载最后一页
								_this.finished = true;
							}
						} else {
							if(!_this.orderList.length) { // 列表没有内容
								_this.noContentShow = true;
								_this.contentShow = false;
							}
						}

					} else {
						_this.$layer.msg(res.message)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.order {
		font-size: 16px;
		font-weight: 500;
		.orderBtn {
			border-bottom: 1px solid #EEEEEE;
			overflow: hidden;
			div {
				float: right;
				width: 2.7rem;
				height: 1.28rem;
				color: #fff;
				background: #7F7F7F;
				border-radius: 4px;
				text-align: center;
				line-height: 1.28rem;
				font-size: 14px;
				margin: 0.43rem 0;
			}
			.payBtn {
				background: #1DCEFF;
				margin-right: 0.32rem;
			}
			.cancelBtn {
				margin-right: 0.5rem;
			}
		}
		.freight {
			font-size: 16px;
			font-weight: 500;
			line-height: 1.38rem;
			border-bottom: 1px solid #EEEEEE;
			p {
				padding-left: 0.48rem;
				padding-right: 0.32rem;
				color: #666;
				span {
					float: right;
					color: #999999;
				}
			}
		}
		.orderInfo {
			padding: 0.48rem 0.32rem;
			overflow: hidden;
			border-bottom: 1px solid #EEEEEE;
			p {
				overflow: hidden;
			}
			.orderNum {
				float: left;
			}
			.orderStatus {
				float: right;
				color: #1DCEFF;
			}
			.goodsDescribe {
				margin-top: 0.64rem;
				margin-bottom: 0.5rem;
				display: flex;
				align-items: center;
				overflow: hidden;
				img {
					width: 25%;
					float: left;
				}
				.goodsDetail {
					float: left;
					width: 70%;
					margin-left: 0.43rem;
					p:first-child {
						font-weight: 500;
						line-height: 0.48rem;
						height: 0.96rem;
						font-size: 14px;
						color: #333333;
						overflow: hidden;
						display: -webkit-box;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					.goodsSize {
						font-size: 12px;
						color: #999999;
						line-height: 0.48rem;
					}
					.goodsPrice {
						font-size: 13px;
						overflow: hidden;
						color: #666;
						line-height: 0.48rem;
						span:first-child {
							float: left;
							color: #1DCEFF;
						}
						span:last-child {
							float: right;
						}
					}
				}
			}
		}
		/*没有订单默认*/
		.noContent {
			text-align: center;
			font-size: 20px;
			color: #999;
			img {
				width: 1.06rem;
				padding-top: 4.88rem;
			}
			p {
				padding-top: 0.4rem;
			}
			button {
				border: none;
				outline: none;
				width: 100%;
				color: #fff;
				font-size: 16px;
				line-height: 1.44rem;
				position: fixed;
				bottom: 0;
				left: 0;
				background: #1DCDFE;
			}
		}
	}
</style>