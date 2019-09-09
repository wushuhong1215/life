<template>
	<div class="logistics">
		<topbar :title="title"></topbar>
		<div v-if="contentShow">
			<div class="logisticsInfo">
				<div class="logisticsLogo">
					<img src="../../../assets/imgs/kuaidi@2x.png" />
				</div>
				<div class="logisticsBasic">
					<h3>{{company}}</h3>
					<p>快递单号：<span>{{trackingNum}}</span><img @click="doCopy" src="../../../assets/imgs/copy@2x.png" /></p>
					<p>[收货地址]{{addressAll}}{{addressInfo}}</p>
				</div>
			</div>
			<van-steps direction="vertical" :active="0" active-color='#333333'>
				<div v-for="item in statusList">
					<van-step>
						<h3>{{item.context}}</h3>
						<p>{{item.time}}</p>
					</van-step>
				</div>
			</van-steps>
		</div>
		<nocontent :isShow="noContentShow"></nocontent>
	</div>
</template>

<script>
	import { apiExpressInfo } from '../../../request/api.js'; // 导入我们的api接口
	import topBar from '../../../components/topBarSec/index.vue'
	import noContent from '../../../components/defaultPage/noContent.vue'
	import Vue from 'vue';
	import { Step, Steps } from 'vant';
	Vue.use(Step).use(Steps);
	export default {
		name: 'logistics',
		components: {
			topbar: topBar,
			nocontent: noContent,
		},
		data() {
			return {
				title: '物流信息',
				active: 0, // 物流状态
				trackingNum: '', // 快递单号
				company: '', // 物流公司
				addressAll: '', // 物流省市区
				addressInfo: '', // 物流详细地址
				statusList: [], // 物流状态列表
				contentShow: true, // 内容显示
				noContentShow: false, // 没内容显示
			}
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				var _this = this;
				apiExpressInfo({
					param1: _this.$route.query.orderId,
				}).then(res => {
					if(res.code == 0) {
						_this.contentShow = true;
						_this.noContentShow = false;
						_this.company = res.data.orderLogisticsName;
						_this.trackingNum = res.data.nu;
						_this.addressAll = res.data.addressAll;
						_this.addressInfo = res.data.addressInfo;
						if(res.data.data) {
							for(let i = 0; i < res.data.data.length; i++) {
								_this.statusList.push(res.data.data[i])
							}
						}
					} else {
						_this.contentShow = false;
						_this.noContentShow = true;
						_this.$layer.msg(res.message);
					}
				})

			},
			doCopy: function() { // 复制快递单号
				var _this = this;
				this.$copyText(this.trackingNum).then(function(e) {
					_this.$layer.msg("复制成功");
				}, function(e) {
					_this.$layer.msg("复制失败");
				})
			},
		},
	}
</script>
<style lang="less">
	.logistics {
		.logisticsInfo {
			margin: 30px 40px;
			overflow: hidden;
			.logisticsLogo {
				background-color: #1DCEFF;
				height: 1.06rem;
				width: 1.06rem;
				border-radius: 50%;
				margin-right: 0.27rem;
				float: left;
				img {
					width: 0.48rem;
					text-align: center;
					margin-left: 0.29rem;
					margin-top: 0.29rem;
				}
			}
			.logisticsBasic {
				float: left;
				font-size: 13px;
				color: #999999;
				width: 80%;
				h3 {
					color: #666666;
					font-size: 16px;
					padding-top: 0.24rem;
				}
				p {
					padding-top: 3px;
				}
				img {
					width: 0.45rem;
					margin-left: 0.24rem;
				}
			}
		}
		.van-steps--vertical {
			margin-left: 1.25rem;
			margin-bottom: 2rem;
		}
		.van-step__line {
			width: 1px!important;
		}
		.van-steps__items>div:last-child .van-step__line {
			display: none;
		}
		.van-step {
			color: #999999!important;
		}
		.van-icon {
			color: #1DCEFF!important;
		}
	}
</style>