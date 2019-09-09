<template>
	<div class="address">
		<topbar :title="this.title"><span class="newAddress" slot='newAddress' @click="toNewAddress">添加地址</span></topbar>
		<van-list v-if="contentShow" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check='isCheck' @load="onLoad">
			<ul class="address-content-box">
				<li class="address-content-wrap" v-for="(item,i) in addressList" :key="i">
					<div class="addressBox">
						<div class="detailBox">
							<p><strong>{{item.addressRecipient}}</strong>{{item.addressMobile}}</p>
							<p><span v-if="item.addressState">默认</span>{{item.addressInfo}}</p>
						</div>
						<button class="editAddress" :id='item.addressId' @click="toEditAddress">编辑</button>
					</div>
				</li>
			</ul>
		</van-list>
		<noaddress :isShow="noContentShow"></noaddress>
	</div>
</template>
<script>
	import topBar from '../../components/topBarSec/index.vue'
	import noAddress from '../../components/defaultPage/noAddress.vue'
	import { apiAddresses } from '../../request/api.js'; // 导入我们的api接口
	import Vue from 'vue';
	import { List } from 'vant';
	Vue.use(List);
	export default {
		components: {
			topbar: topBar,
			noaddress: noAddress,
		},
		data() {
			return {
				title: '地址管理',
				contentShow: true, // 内容显示
				noContentShow: false, // 没有内容显示
				pageIndex: 1, // 分页页码
				pageSize: 10, // 分页大小
				addressList: [], // 地址列表
				address: '', // 选中的地址
				loading: true, // 上拉加载更多
				finished: false, // 上拉加载更多
				isCheck: false, // 监听首页加载
			}
		},
		activated() {
			this.addressList = [];
			this.pageIndex = 1;
			this.loading = true;
			this.finished = false;
			this.noContentShow = false;
			this.contentShow = true;
			this.onLoad();
		},
		methods: {
			onLoad() {
				setTimeout(() => {
					this.getDatas({
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
					});
				}, 1000);
			},
			toNewAddress() { // 新建地址
				this.$router.push({
					path: '/newAddress'
				});
			},
			toEditAddress(data) { // 编辑地址
				for(let i = 0; i < this.addressList.length; i++) { // 过滤选中项参数
					if(this.addressList[i].addressId == data.target.id) {
						this.adress = this.addressList[i];
					}
				};
				this.$router.push({
					path: '/editAddress',
					name: 'editAddress',
					params: this.adress,
				});
			},
			getDatas(datas) { // 获取数据
				var _this = this;
				apiAddresses(datas).then(res => {
					if(res.code == 0) {
						if(res.data.list) {
							_this.loading = false;
							_this.noContentShow = false;
							_this.contentShow = true;
							_this.pageIndex++;
							for(let i = 0; i < res.data.list.length; i++) {
								res.data.list[i].addressDetail = res.data.list[i].addressInfo;
								res.data.list[i].addressInfo = res.data.list[i].addressAll + res.data.list[i].addressInfo;
								_this.addressList.push(res.data.list[i]);
							}
							if(res.data.lastPage) {
								_this.finished = true;
							}

						} else {
							if(!_this.addressList.length) {
								_this.noContentShow = true;
								_this.contentShow = false;
							}
						}

					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.address {
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
		.newAddress {
			font-size: 17px;
			position: absolute;
			right: 0.45rem;
		}
	}
</style>