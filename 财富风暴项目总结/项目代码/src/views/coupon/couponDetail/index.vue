<template>
	<div class="couponDetail">
		<topbar :title="this.title"></topbar>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check='isCheck' @load="onLoad">
			<ul class="listBox">
				<li v-for="item in couponList" :class="item.couponStatus ? '' : 'overdue'">
					<div>
						<p class="fl"><strong>{{item.couponSourceName}}</strong><br /><span class="obtainDate" :class="item.couponStatus ? '' : 'overdue'">{{item.memberCouponCreateTime}}</span></p>
						<p class="rl"><strong class="couponNum" :class="item.couponSymbol ? '' : 'selectRed'">{{item.couponValue}}</strong></p>
					</div>
				</li>
			</ul>
		</van-list>

		<nocontent :isShow="noContentShow"></nocontent>
	</div>
</template>

<script>
	import { apiMemberCoupons } from '../../../request/api.js'; // 导入我们的api接口
	import topBar from '../../../components/topBarSec/index.vue'
	import noContent from '../../../components/defaultPage/noContent.vue'
	import Vue from 'vue';
	import { List } from 'vant';
	Vue.use(List);
	export default {
		name: 'couponDetail',
		components: {
			topbar: topBar,
			nocontent: noContent,
		},
		data() {
			return {
				title: '礼券明细',
				isShow: false, // 是否显示缺省页
				pageIndex: 1, // 分页页数
				pageSize: 10, // 分页数量
				couponList: [], // 礼券列表
				loading: true, // 是否处于加载状态，加载过程中不触发load事件
				finished: false, // 是否已加载完成，加载完成后不再触发load事件
				isCheck: false, // 分页首页加载
				contentShow: true, // 内容页面
				noContentShow: false, // 缺省页面
			}
		},
		activated() {
			this.init();
			this.onLoad();
		},
		methods: {
			init() { // 初始化
				this.loading = true;
				this.finished = false;
				this.couponList = [];
				this.pageIndex = 1;
			},
			onLoad() { // 分页
				setTimeout(() => {
					this.getDatas({
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
					});
				}, 1000);
			},

			getDatas: function(datas) { // 获取列表数据
				var _this = this;
				apiMemberCoupons(datas).then(res => {
					if(res.code == 0) {
						if(res.data.list) {
							_this.loading = false;
							_this.noContentShow = false;
							_this.contentShow = true;
							_this.pageIndex++;
							for(let i = 0; i < res.data.list.length; i++) {
								res.data.list[i].memberCouponCreateTime = res.data.list[i].memberCouponCreateTime.split(" ")[0];
								if(!res.data.list[i].couponSymbol) {
									res.data.list[i].couponValue = '-' + res.data.list[i].couponValue
								} else {
									res.data.list[i].couponValue = '+' + res.data.list[i].couponValue
								}
								if(!res.data.list[i].couponSymbol) {
									res.data.list[i].couponSourceName = res.data.list[i].couponSourceName;
								} else {
									if(!res.data.list[i].couponStatus) {
										res.data.list[i].couponSourceName = res.data.list[i].couponSourceName + '（过期）';
									}
								}
								_this.couponList.push(res.data.list[i]);
							};
							if(res.data.lastPage) { // 加载最后一页
								_this.finished = true;
							}
						} else {
							if(!_this.couponList.length) {
								_this.noContentShow = true;
								_this.contentShow = false;
							}
						}
					} else {
						_this.$layer.msg(res.message)
					}
				});
			},
		}
	}
</script>

<style lang="less">
	.lose {
		color: #D41E26;
	}
	
	.selectRed {
		color: #D41E26;
	}
	
	.couponDetail {
		.listBox {
			.overdue {
				color: #E0E0E0!important;
			}
			padding: 0.26rem 0;
			li {
				font-size: 16px;
				width: 100%;
				border-bottom: 1px solid #EEEEEE;
				div {
					position: relative;
					overflow: hidden;
					padding: 0.26rem 0.32rem;
					p {
						.obtainDate {
							font-size: 14px;
							color: #999;
							line-height: inherit;
						}
					}
					p:last-child {
						color: #666;
						position: absolute;
						right: 0;
						top: 50%;
						transform: translate(-0.32rem, -50%);
					}
				}
			}
		}
	}
</style>