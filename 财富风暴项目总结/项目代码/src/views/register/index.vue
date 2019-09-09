<template>
	<div class="register">
		<topbar :title="this.title"></topbar>
		<ul class="list listBox">
			<li><input type="text" placeholder="输入手机号/邮箱" v-model="account" /></li>
			<li><input class="authCode" type="text" placeholder="输入验证码" v-model="authCode" /><input :disabled="isDisabled" class="sendBtn" :value="authCodeBtn" type="button" @click="sendCode" /></li>
			<li><input type="password" placeholder="输入6-20位数字或字母作为密码" v-model="password" /></li>
		</ul>
		<button class="confirm" :class="{clicked: isClicked}" @click="confirm" :disabled="isDisabled2">立即注册</button>
		<p class="registerTips">点击发送验证码，即表示您同意
			<a href="javascript:;" @click="toAgreement">《财富风暴注册协议》</a>
		</p>
	</div>
</template>

<script>
	import topBar from '../../components/topBarSec/index.vue'
	import { apiVerificationCode, apiRegister, apiKey, apiLogin } from '../../request/api.js'; // 导入我们的api接口
	import { Toast } from 'vant';
	export default {
		name: 'register',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '注册',
				account: '', // 账号
				password: '', // 密码
				authCode: '', // 验证码
				authCodeBtn: '发送验证码', // 按钮名称
				totalTime: 61, // 倒计时
				isDisabled: false, //发送验证码按钮是否可以点击
				isDisabled2: false, //确定按钮是否可点击
				timer: null, // 倒计时
				rsaPassword: '', // 加密密码
				m: '', // 公钥模数
				isClicked: false,
			}
		},
		mounted() {
			window.eventBus.$on('toReturn', (data) => {
				clearInterval(this.timer);
				this.isDisabled = false;
				this.totalTime = 61;
				this.authCodeBtn = '发送验证码';
			})
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				this.totalTime = 61;
				this.authCodeBtn = '发送验证码';
				this.account = '';
				this.password = '';
				this.authCode = '';
			},
			sendCode() { // 发送验证码
				var _this = this;
				if(!this.account) {
					this.$layer.msg('请输入手机号/邮箱');
					return false;
				}
				apiVerificationCode({
					param1: this.account
				}).then(res => {
					if(res.code == 0) {
						_this.$layer.msg('验证码发送成功');
						_this.countdown();
					} else {
						_this.$layer.msg(res.message)
					}
				})

			},
			countdown() { // 倒计时
				var _this = this;
				this.isDisabled = true;
				_this.timer = setInterval(() => {
					_this.totalTime--;
					_this.authCodeBtn = _this.totalTime + 's后重试';
					if(_this.totalTime == 0) {
						clearInterval(_this.timer);
						_this.totalTime = 61;
						this.isDisabled = false;
						_this.authCodeBtn = '发送验证码';
					}
				}, 1000)
			},

			toAgreement() { // 跳转协议
				this.$router.push({
					path: '/agreement'
				});
			},
			confirm() { // 确定
				var _this = this;
				if(!this.account) {
					this.$layer.msg('请输入手机号/邮箱');
					return false;
				};
				if(!this.authCode) {
					this.$layer.msg('请输入验证码');
					return false;
				};
				if(!this.password) {
					this.$layer.msg('请输入密码');
					return false;
				};
				if(this.password.length < 6 || this.password.length > 20) {
					this.$layer.msg('密码格式错误');
					return false;
				};
				this.isClicked = true;
				apiRegister({
					username: this.account,
					password: this.password,
					smsCaptcha: this.authCode,
				}).then(res => {
					if(res.code == 0) {
						apiKey({}).then(res => {
							if(res.code == 0) {
								_this.m = res.data.m;
								_this.rsaPassword = encrypt({
									m: res.data.m,
									e: res.data.e
								}, _this.password);

								apiLogin({
									username: _this.account,
									password: _this.rsaPassword,
									m: _this.m,
								}).then(res => {
									if(res.code == 0) {
										localStorage.setItem('account', _this.account);
										localStorage.setItem('access_token', res.data.access_token);
										Toast.success('注册成功');
										setTimeout(function() {
											clearInterval(_this.timer);
											Toast.clear();
											_this.$router.push({
												path: '/teletext'
											});
											_this.isClicked = false;
											_this.isDisabled = false;
											_this.isDisabled2 = false;
											_this.totalTime = 61;
											_this.authCodeBtn = '发送验证码';
											_this.account = '';
											_this.password = '';
											_this.authCode = '';
										}, 1800)
									} else {
										_this.isClicked = false;
										_this.$layer.msg(res.message);
									}
								})
							}
						});
						var encrypt = function(key, plaintext) {
							if(key) {
								var rsa = new RSAKey();
								rsa.setPublic(key.m, key.e);
								var ciphertext = rsa.encrypt(plaintext);
								return ciphertext;
							}
						};
					} else {
						_this.isDisabled2 = false;
						_this.$layer.msg(res.message);
					}
				})
				this.isDisabled2 = true;
			}
		}
	}
</script>

<style lang="less" scoped>
	.unclickable {
		background: #8CE7FF!important;
	}
	
	.register {
		.registerTips {
			text-align: center;
			font-size: 14px;
			color: #ccc;
			a {
				color: #19D4FF;
			}
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