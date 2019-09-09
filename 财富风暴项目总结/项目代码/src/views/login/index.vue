<template>
	<div id="login">
		<div id="loginBox">
			<p class="close" @click="closeLogin">关闭</p>
			<img class="loginLogo" src="../../assets/imgs/login/logo.png" />
			<div class="login-box">
				<div class="list"><input type="text" placeholder="输入手机/邮箱" v-model="account" class="user text loginInput"></div>
				<div class="list"><input type="password" placeholder="输入密码" v-model="password" class="pass text loginInput"></div>
				<div class="list"><button class="weui-btn btn weui-btn_default" :class="{clicked: isClicked}" @click="loginVerify">登录</button></div>
				<div class="list clearfix">
					<div class="fl" @click="toRegister">
						<a href="javascript:;">快速注册</a>
					</div>
					<div class="fr" @click="toForgetPass">
						<a href="javascript:;">忘记密码</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { apiKey, apiLogin } from '../../request/api.js'; // 导入我们的api接口
	import { Toast } from 'vant'
	export default {
		name: 'login',
		data() {
			return {
				account: '', // 账号
				password: '', // 密码
				rsaPassword: '', // 加密密码
				m: '', // 公钥模数
				isClicked: false, // 是否可点击
			}
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				if(this.$route.query.account) {
					this.account = this.$route.query.account;
				};
				//debugger
				if(!localStorage.getItem('access_token')) {
					this.password = '';
				}
			},
			closeLogin() { // 关闭页面
				this.$router.push({
					path: '/teletext'
				});
			},
			toRegister() { // 注册
				this.$router.push({
					path: '/register'
				});
			},
			toForgetPass() { // 忘记密码
				this.$router.push({
					path: '/forgetPass'
				});
			},
			loginVerify() { // 登录验证
				var _this = this;
				var account = this.account;
				var password = this.password;
				if(!account) {
					this.$layer.msg('请输入账号');
					return false;
				};

				if(!(/^1[3456789]\d{9}$/.test(account))) {
					if(!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(account)) {
						this.$layer.msg('请输入正确的账号');
						return false;
					}
				};

				if(!password) {
					this.$layer.msg('请输入密码');
					return false;
				};
				this.isClicked = true;
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
								Toast.success('登录成功');
								setTimeout(function() {
									Toast.clear();
									_this.$router.push({
										path: '/teletext'
									});
									_this.isClicked = false;
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
			}
		},
	}
</script>

<style lang="less">
	html,
	body {
		height: 100%;
		width: 100%;
	}
	
	#clicked {
		background: #18A4CB!important;
	}
	
	.clearfix a {
		color: rgba(255, 255, 255, 0.8);
	}
	
	#app {
		height: 100%;
	}
	
	#login {
		display: flex;
		height: 100%;
		font-size: 16px;
		background: linear-gradient(135deg, rgba(39, 176, 255, 1) 0%, rgba(38, 177, 255, 1) 21%, rgba(23, 204, 255, 1) 51%, rgba(22, 205, 255, 1) 100%, rgba(136, 243, 255, 1) 100%);
	}
	
	#login #loginBox {
		color: #fff;
		padding: 1.62rem 1.107rem;
		width: 100%;
		text-align: center;
		/*position: relative;*/
	}
	
	#login #loginBox .loginLogo {
		width: 2.97rem;
		text-align: center;
		padding-top: 1.45rem;
		margin-bottom: 0.81rem;
	}
	
	#login #loginBox .close {
		width: 32px;
		height: 22px;
		font-size: 16px;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.8);
		line-height: 22px;
		position: absolute;
		right: 1.107rem;
	}
	
	.login-box {
		max-width: 280px;
		margin: 0 auto;
	}
	
	.login-box .list {
		margin-bottom: 0.81rem;
	}
	
	.login-box .list input.text {
		padding-left: 1.1rem;
		border-bottom: 1px solid #fff;
		background: none;
		height: 0.945rem;
		width: 100%;
		border: none;
		outline: 0;
		color: #fff;
	}
	
	.login-box .list:nth-child(1),
	.login-box .list:nth-child(2) {
		border-bottom: 1px solid #fff;
	}
	
	input::-webkit-input-placeholder {
		color: rgba(255, 255, 255, 0.5);
	}
	
	.login-box .list .btn {
		width: 100%;
		border-radius: 10px;
		border: 1px solid #8de5ff;
		background: #2acfff;
		text-align: center;
		color: #fff;
		line-height: 1.296rem;
	}
	
	.fl {
		float: left;
	}
	.fr {
		float: right;
	}
	.login-box .list input.user {
		background: url(../../assets/imgs/login/number.png) no-repeat 2px;
	}
	
	.login-box .list input.pass {
		background: url(../../assets/imgs/login/key.png) no-repeat 2px;
	}
	
	.loginInput::-webkit-input-placeholder {
		color: #8FDDFF!important;
	}
	
	.loginInput:-moz-placeholder {
		color: #8FDDFF!important;
	}
	
	.loginInput:-ms-input-placeholder {
		color: #8FDDFF!important;
	}
</style>