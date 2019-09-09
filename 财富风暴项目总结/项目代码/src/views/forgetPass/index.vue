<template>
	<div class="forgetPass">
		<topbar :title="this.title"></topbar>
		<ul class="list listBox">
			<li><input type="text" placeholder="输入手机号/邮箱" v-model="account" /></li>
			<li><input class="authCode" type="text" placeholder="输入验证码" v-model="authCode" /><input :disabled="isDisabled" class="sendBtn" :value="authCodeBtn" type="button" @click="sendCode" /></li>
			<li><input type="password" placeholder="输入6-20位数字或字母作为新密码" v-model="newPass" /></li>
			<li><input type="password" placeholder="确认新密码" v-model="confirmPass" /></li>
		</ul>
		<button class="confirm" :class="{clicked: isClicked}" @click="confirm" :disabled="isDisabled2">完成</button>
	</div>
</template>

<script>
	import topBar from '../../components/topBarSec/index.vue'
	import { apiAuthCode, apiForgetpassword } from '../../request/api.js';
	import { Toast } from 'vant';
	export default {
		name: 'forgetPass',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '忘记密码', // 标题
				account: '', // 账号
				newPass: '', // 新密码
				confirmPass: '', // 确认密码
				authCode: '', // 验证码
				authCodeBtn: '发送验证码',
				totalTime: 61, // 倒计时
				isDisabled: false, //发送验证码按钮是否可以点击
				isDisabled2: false, //确定按钮是否可点击
				timer: null, // 定时器名称 
				isClicked: false,
			}
		},
		activated() {
			this.init();
		},
		mounted() {
			window.eventBus.$on('toReturn', (data) => {
				clearInterval(this.timer);
				this.isDisabled = false;
				this.totalTime = 61;
				this.authCodeBtn = '发送验证码';
			})
		},
		methods: {
			init() { //初始化
				this.totalTime = 61;
				this.authCodeBtn = '发送验证码';
				this.account = '';
				this.newPass = '';
				this.confirmPass = '';
				this.authCode = '';
			},
			sendCode() { // 发送验证码
				var _this = this;
				if(!this.account) {
					this.$layer.msg('请输入手机号/邮箱');
					return false;
				};
				if(!(/^1[3456789]\d{9}$/.test(this.account))) {
					if(!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.account)) {
						this.$layer.msg('手机号/邮箱格式错误');
						return false;
					};
				};
				apiAuthCode({
					param1: _this.account,
					token: localStorage.getItem('access_token'),
				}).then(res => {
					if(res.code == 0) {
						_this.$layer.msg('验证码发送成功');
						_this.countdown();
					} else {
						_this.$layer.msg(res.message)
					}
				})
			},
			confirm() { // 确认
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
				this.isClicked = true;
				apiForgetpassword({
					username: _this.account,
					password: _this.newPass,
					smsCaptcha: _this.authCode,
				}).then(res => {
					if(res.code == 0) {
						Toast.success('修改成功');
						setTimeout(function() {
							clearInterval(_this.timer);
							Toast.clear();
							_this.$router.push({
								path: '/login',
								query: {
									account: _this.account,
								}
							});
							_this.isDisabled = false;
							_this.isDisabled2 = false;
							_this.authCodeBtn = '发送验证码';
							_this.account = '';
							_this.newPass = '';
							_this.confirmPass = '';
							_this.authCode = '';
							_this.isClicked = false;
						}, 1800)
					} else {
						_this.isClicked = false;
						_this.$layer.msg(res.message);
					}
				})
			},
			countdown() { // 倒计时
				var _this = this;
				this.isDisabled = true;
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
	.forgetPass {
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
	
	.unclickable {
		background: #8CE7FF!important;
	}
</style>