<template>
	<div class="personalData">
		<topbar :title="this.title"></topbar>
		<ul class="list personalBox">
			<li @click="bindPhone">
				<div>绑定手机</div>
				<div>{{memberMobile}}<i v-if="phoneArrowShow" class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="bindEmail">
				<div>绑定邮箱</div>
				<div>{{memberEmail}}<i v-if="emailArrowShow" class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="modPass">
				<div>修改密码</div>
				<div><i class="fa fa-angle-right arrow-right"></i></div>
			</li>
		</ul>
		<button class="loggedOut" :class="{clicked: isClicked}" @click="loggedOut">退出登录</button>
	</div>
</template>

<script>
	import { apiGetmember } from '../../request/api.js'; // 导入我们的api接口
	import topBar from '../../components/topBarSec/index.vue'
	import { Dialog } from 'vant';
	export default {
		name: 'personalData',
		data() {
			return {
				title: '账号管理',
				memberMobile: '', // 是否绑定手机
				memberEmail: '', // 是否绑定邮箱
				phoneArrowShow: true, // 是否显示箭头
				emailArrowShow: true, // 是否显示箭头
				isClicked: false,
			}
		},
		components: {
			topbar: topBar
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				var _this = this;
				apiGetmember({}).then(res => {
					if(res.code == 0) {
						res.data.memberMobile ? _this.memberMobile = res.data.memberMobile : _this.memberMobile = '去绑定';
						res.data.memberEmail ? _this.memberEmail = res.data.memberEmail : _this.memberEmail = '去绑定';
						if(res.data.memberMobile) {
							_this.phoneArrowShow = false;
						}
						if(res.data.memberEmail) {
							_this.emailArrowShow = false;
						}

					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
			bindPhone() { // 绑定手机号
				if(this.memberMobile == '去绑定') {
					this.$router.push({
						path: '/bindPhone',
						query: {
							source: 'phone'
						}
					});
				}
			},
			bindEmail() { // 绑定邮箱号
				if(this.memberEmail == '去绑定') {
					this.$router.push({
						path: '/bindPhone',
						params: {
							source: 'email'
						}
					});
				}
			},
			modPass() { // 修改密码
				this.$router.push({
					path: '/modPass'
				});
			},
			loggedOut() { // 退出登录
				var _this = this;
				localStorage.removeItem('access_token');
				localStorage.removeItem('account');
				this.isClicked = true;
				Dialog.confirm({
					title: '提示',
					message: '是否退出登录'
				}).then(() => {
					_this.$router.push({
						path: '/teletext'
					});
					_this.isClicked = false;
				}).catch(() => {
					_this.isClicked = false;
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.personalData {
		.personalBox>li {
			color: #666;
			font-size: 16px;
			line-height: 1.33rem;
			height: 1.33rem;
			border-bottom: 1px solid #eee;
			div:first-child {
				padding-left: 12px;
				float: left;
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
		.loggedOut {
			color: #fff;
			font-size: 16px;
			height: 1.44rem;
			background: linear-gradient(135deg, rgba(44, 207, 253, 1) 0%, rgba(22, 205, 255, 1) 100%, rgba(44, 206, 254, 1) 100%);
			border-radius: 8px;
			padding: 0;
			border: 1px solid transparent;
			outline: none;
			width: 9.06rem;
			margin: 0.45rem auto;
			display: block;
		}
		.clicked {
			background: #17A4CB!important;
		}
	}
</style>