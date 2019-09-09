<template>
	<div id="my">
		<div class="m-main">
			<div class="member-top">会员</div>
			<ul class="memberBox">
				<li class="personalData" @click="toPersonalData">
					<img alt="财富风暴" :src="memberHeadPicUrl" />
					<div>修改个人资料<i class="fa fa-angle-right arrow-right"></i></div>
				</li>
				<li @click="toOrder">
					<div>我的订单</div>
					<div>更多<i class="fa fa-angle-right arrow-right"></i></div>
				</li>
				<li class="orderStatus">
					<a class="icon01" id='1' @click="toOrderStatus">待付款</a>
					<a class="icon02" id='3' @click="toOrderStatus">待发货</a>
					<a class="icon03" id='4' @click="toOrderStatus">待收货</a>
					<a class="icon04" id='5' @click="toOrderStatus">已完成</a>
				</li>
				<li @click="toIDAuth">
					<div>身份认证</div>
					<div>{{memberRealName}}<span> {{isCertification}}</span><i class="fa fa-angle-right arrow-right"></i></div>
				</li>
				<li @click="toAddress">
					<div>地址管理</div>
					<div><i class="fa fa-angle-right arrow-right"></i></div>
				</li>

				<li @click="toCoupon">
					<div>礼券中心</div>
					<div>{{couponSum}}礼券<i class="fa fa-angle-right arrow-right"></i></div>
				</li>
				<li @click="toAccount">
					<div>账号管理</div>
					<div><i class="fa fa-angle-right arrow-right"></i></div>
				</li>
				<li>
					<div>服务热线</div>
					<div style="padding-right: 10px;">
						<a href="tel:0147-88469258">400-601-9988</a>
					</div>
				</li>
				<li>
					<div>服务时间</div>
					<div style="padding-right: 10px;">周一至周五09:00-18:00</div>
				</li>
			</ul>
		</div>
		<van-dialog v-model="informationShow" show-cancel-button :before-close='beforeClose'>
			<div class="information">
				<p>请填写姓名</p>
				<input v-model="name" class="jobValue" type="text" placeholder="请输入姓名" />
			</div>
			<div class="information">
				<p>请填写身份证号</p>
				<input v-model="idNumber" class="jobValue" type="text" placeholder="请输入身份证号" />
			</div>
		</van-dialog>
		<bottom-bar></bottom-bar>
	</div>
</template>
<script>
	import { apiGetmember, apiCouponsum, apiMember } from '../../request/api.js'; // 导入我们的api接口
	import bottomBar from '../../components/bottomBar/index.vue'
	import { Toast } from 'vant'
	export default {
		components: {
			bottomBar
		},
		data() {
			return {
				name: '', // 名字
				idNumber: '', // 身份证号码
				memberRealName: '', // 身份认证
				informationShow: false, // 是否显示身份认证
				couponSum: '0', // 礼券总数
				memberHeadPicUrl: require('../../assets/imgs/my/my-logo.png'), // 会员头像
				isCertification: '未认证', // 是否认证
			}
		},
		activated() {
			this.init(); 
		},
		methods: {
			init() { // 初始化
				var _this = this;
				if(!localStorage.getItem('access_token')) {
					this.$router.push({
						path: '/login'
					});
				} else {
					apiGetmember({}).then(res => { // 获取个人信息
						if(res.code == 0) {
							if(res.data.memberRealName) {
								_this.memberRealName = res.data.memberRealName;
								_this.name = _this.memberRealName;
							} else {
								_this.memberRealName = '';
							};
							if(res.data.memberHeadPicUrl) {
								_this.memberHeadPicUrl = window.alyun + res.data.memberHeadPicUrl;
							}
							res.data.memberIdNo ? _this.isCertification = "已认证" : _this.isCertification = "未认证";

						} else {
							_this.$layer.msg(res.message)
						}
					})
					apiCouponsum({}).then(res => { // 获取礼券总额
						if(res.code == 0) {
							_this.couponSum = res.data;
						} else {
							_this.$layer.msg(res.message)
						}
					})
				}

			},
			beforeClose(action, done) { // 身份认证
				var _this = this;
				if(action === 'confirm') {
					if(!this.name) {
						this.$layer.msg('姓名不能为空');
						done(false);
						return false;
					};
					if(this.idNumber) {
						if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.idNumber)) {
							this.$layer.msg('请输入正确的身份证号码');
							done(false)
							return false;
						};
					};
					if(this.idNumber) {
						var data = {
							memberRealName: _this.name,
							memberIdNo: _this.idNumber
						};
					} else {
						var data = {
							memberRealName: _this.name
						};
					}
					apiMember(data).then(res => {
						if(res.code == 0) {
							_this.memberRealName = _this.name;
							_this.idNumber ? _this.isCertification = "已认证" : _this.isCertification = "未认证";
							_this.idNumber ? Toast.success('认证成功') : Toast.success('编辑成功')
							_this.idNumber = '';
							_this.name = '';
							done();
							setTimeout(function() {
								Toast.clear();
							}, 1800)
						} else {
							_this.$layer.msg(res.message);
							done(false);
						}
					})
				} else {
					_this.name = '';
					_this.idNumber = '';
					done();
				}
			},
			toPersonalData() { // 个人中心
				this.$router.push({
					path: '/personalData'
				});
			},
			toAccount() { // 账号
				this.$router.push({
					path: '/account'
				});
			},
			toOrder() { // 我的订单
				this.$router.push({
					path: '/order',
					query: {
						active: '0',
					},
				});
			},
			toOrderStatus(value) { // 我的订单（状态）
				this.$router.push({
					path: '/order',
					query: {
						active: value.target.id,
					},
				});
			},
			toIDAuth() { // 身份认证
				if(this.isCertification == '未认证') {
					this.informationShow = true;
				} else {
					this.$layer.msg('已经认证');
				}
			},
			toAddress() { // 地址管理
				this.$router.push({
					path: '/address'
				});
			},

			toCoupon() { // 礼券中心
				this.$router.push({
					path: '/coupon'
				});
			},

		},
	}
</script>
<style lang="less">
	@import '../../assets/css/border.less';
	#my {
		margin-bottom: 1.512rem;
		.member-top {
			position: relative;
			line-height: 1.215rem;
			font-weight: 600;
			font-size: 20px;
			text-align: center;
			color: #fff;
			background: linear-gradient(135deg, rgba(39, 176, 255, 1) 0%, rgba(38, 177, 255, 1) 21%, rgba(23, 204, 255, 1) 51%, rgba(22, 205, 255, 1) 100%, rgba(136, 243, 255, 1) 100%);
		}
		.m-main {
			margin-bottom: 100px;
			.memberBox>.personalData {
				overflow: hidden;
				height: 1.7rem;
				line-height: 1.8rem;
				img {
					height: 1.38rem;
					margin-top: 0.16rem;
					margin-left: 0.32rem;
					height: 1.39rem;
					width: 1.39rem;
					border-radius: 50%;
				}
				div:last-child {
					.arrow-right {
						top: 0.45rem;
					}
				}
			}
			.memberBox>.orderStatus {
				height: 2.6rem;
				padding: 0.42rem 0.53rem;
				font-size: 16px;
				a {
					padding-top: 0.9rem;
					display: block;
					text-align: center;
					width: 25%;
					float: left;
					color: #666;
				}
				.icon01 {
					background: url(../../assets/imgs/my/daifukuan.png) no-repeat top/1.22rem auto;
				}
				.icon02 {
					background: url(../../assets/imgs/my/daifahuo.png) no-repeat top/1.22rem auto;
				}
				.icon03 {
					background: url(../../assets/imgs/my/daishouhuo.png) no-repeat top/1.22rem auto;
				}
				.icon04 {
					background: url(../../assets/imgs/my/yiwancheng.png) no-repeat top/1.22rem auto;
				}
			}
			.memberBox>li {
				overflow: hidden;
				color: #999!important;
				font-size: 16px;
				line-height: 1.4rem;
				height: 1.33rem;
				border-bottom: 1px solid #eee;
				a {
					color: #999;
				}
				div:first-child {
					padding-left: 12px;
					float: left;
					color: #666;
				}
				div:last-child {
					padding-right: 30px;
					float: right;
					position: relative;
					.arrow-right {
						padding-left: 10px;
						position: absolute;
						right: 10px;
						top: 0.265rem;
						height: 0.8rem;
						line-height: 0.8rem;
						font-size: 26px;
					}
				}
			}
		}
	}
	
	.vl-notify.vl-notify-msg {
		z-index: 99999;
	}
	
	.van-dialog {
		width: 70%;
	}
	
	.information:last-child {
		margin-bottom: 0.8rem;
		p {
			padding-top: 0.48rem;
		}
	}
	
	.information {
		text-align: center;
		font-size: 17px;
		color: #030303;
		p {
			padding-top: 0.72rem;
			padding-bottom: 8px;
		}
		.jobValue {
			width: 70%;
			margin: 0 auto;
			display: block;
			border: 1px solid #BEBEBE;
			height: 1.33rem;
			border-radius: 5px;
			outline: none;
			font-size: 18px;
			padding-left: 8px;
		}
	}
</style>