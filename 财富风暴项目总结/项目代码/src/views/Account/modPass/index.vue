<template>
	<div class="modPass">
		<topbar :title="this.title"></topbar>

		<ul class="list listBox">
			<p class="identify">账号已与{{account}}绑定，请输入验证码确认身份</p>
			<li><input class="authCode" type="text" placeholder="输入验证码" v-model="authCode" /><input :disabled="isDisabled" class="sendBtn" :value="authCodeBtn" type="button" @click="sendCode" /></li>
			<li><input type="password" placeholder="输入6-20位数字或字母作为新密码" v-model="newPass" /></li>
			<li><input type="password" placeholder="确认新密码" v-model="confirmPass" /></li>
		</ul>
		<button class="confirm" @click="confirm" :disabled="isDisabled2">确定</button>
	</div>
</template>
<script>
	import { apiModification, apiModpassCode, apiGetmember } from '../../../request/api.js'; // 导入我们的api接口
	import topBar from '../../../components/topBarSec/index.vue'
	import { Toast } from 'vant';
	export default {
		name: 'modPass',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '修改密码',
				bindPhone: '', // 绑定的手机号
				bindEmail: '', // 绑定邮箱
				newPass: '', // 新密码
				confirmPass: '', // 确认密码
				authCode: '', // 验证码
				account: '', // 登录的账号
				memberMobile: '', // 会员手机号码
				memberEmail: '', // 会员邮箱
				authCodeBtn: '发送验证码',
				totalTime: 61,
				isDisabled: false, //发送验证码按钮是否可以点击
				isDisabled2: false, //确定按钮是否可点击
			}
		},
		activated() {
			this.init();
		},
		mounted() {
			window.eventBus.$on('toReturn', (data) => {
				let _this = this;
				clearInterval(_this.timer);
				_this.isDisabled = false;
				_this.authCodeBtn = '发送验证码';
			})
		},
		methods: {
			init() { // 初始化
				var _this = this;
				if(/^1[3456789]\d{9}$/.test(localStorage.getItem('account'))) {
					this.account = localStorage.getItem('account').replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
				} else {
					this.account = localStorage.getItem('account').replace(/(.{2}).+(.{2}@.+)/g, "$1****$2");
				}
				this.totalTime = 61;
				this.authCodeBtn = '发送验证码';
				this.authCode = '';
				this.newPass = '';
				this.confirmPass = '';
				apiGetmember({}).then(res => {
					if(res.code == 0) {
						if(res.data.memberMobile) _this.memberMobile = res.data.memberMobile;
						if(res.data.memberEmail) _this.memberEmail = res.data.memberEmail;
					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
			sendCode() { // 发送验证码
				var _this = this;
				apiModpassCode({
					param1: localStorage.getItem('account')
				}).then(res => {
					if(res.code == 0) {
						_this.isDisabled = true;
						_this.$layer.msg('验证码发送成功');
						_this.countdown();
					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
			confirm() { // 提交
				var _this = this;
				if(!this.authCode) {
					this.$layer.msg('请输入验证码');
					return false;
				};
				if(!this.newPass) {
					this.$layer.msg('请输入新密码');
					return false;
				};
				if(!this.confirmPass) {
					this.$layer.msg('请输入确认密码');
					return false;
				};
				if(!(/^[a-zA-Z0-9]{6,20}$/).test(this.newPass)) {
					this.$layer.msg('密码格式错误');
					return false;
				}
				if(!(/^[a-zA-Z0-9]{6,20}$/).test(this.confirmPass)) {
					this.$layer.msg('确认密码格式错误');
					return false;
				}
				if(this.confirmPass != this.newPass) {
					this.$layer.msg('两次输入的密码不一致，请重新输入');
					return false;
				};
				this.isDisabled2 = true;
				apiModification({
					password: _this.newPass,
					smsCaptcha: _this.authCode
				}).then(res => {
					if(res.code == 0) {
						Toast.success('修改成功');
						setTimeout(function() {
							clearInterval(_this.timer);
							_this.isDisabled = false;
							_this.isDisabled2 = false;
							_this.authCodeBtn = '发送验证码';
							localStorage.removeItem('access_token');
							Toast.clear();
							_this.$router.push({
								path: '/login',
								query: {
									account: localStorage.getItem('account')
								}
							});
						}, 1800)
					} else {
						_this.isDisabled2 = false;
						_this.$layer.msg(res.message)
					}
				})

			},
			countdown() { // 倒计时
				var _this = this;
				this.timer = setInterval(() => {
					_this.totalTime--;
					_this.authCodeBtn = _this.totalTime + 's后重试';
					if(_this.totalTime == 0) {
						clearInterval(_this.timer);
						_this.isDisabled = false;
						_this.totalTime = 61;
						_this.authCodeBtn = '发送验证码';
					}
				}, 1000)
			},
		}
	}
</script>

<style lang="less" scoped>
	.unclickable {
		background: #8CE7FF!important;
	}
	
	.modPass {
		.identify {
			font-size: 16px;
			color: #666;
			padding: 0 0.88rem;
			padding-top: 0.48rem;
			text-align: center;
		}
		.listBox>li {
			width: 9.06rem;
			height: 1.44rem;
			background: rgba(237, 237, 237, 0);
			border-radius: 8px;
			border: 1px solid rgba(168, 168, 168, 1);
			margin: 0.42rem auto;
			input {
				background: none;
				outline: none;
				border: none;
				height: 1.44rem;
				width: 100%;
				padding-left: 0.45rem;
				font-size: 16px;
			}
			.authCode {
				width: 6.29rem;
				border-right: 1px solid #ccc;
			}
			.sendBtn {
				text-align: center;
				font-size: 16px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(29, 206, 255, 1);
				width: 2.7rem;
				display: inline-block;
				float: right;
				line-height: 1.44rem;
				padding-left: 0;
			}
		}
		.confirm {
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
			margin-top: 0.75rem;
			display: block;
		}
	}
</style>