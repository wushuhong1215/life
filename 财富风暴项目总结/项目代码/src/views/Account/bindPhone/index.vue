<template>
	<div class="bindPhone">
		<topbar :title="this.title"></topbar>
		<ul class="list listBox">
			<li><input type="text" :placeholder="placeholder" v-model="phone" /></li>
			<li><input class="authCode" type="text" placeholder="输入验证码" v-model="authCode" /><input :disabled="isDisabled" class="sendBtn" :value="authCodeBtn" type="button" @click="sendCode" /></li>
		</ul>
		<button :disabled="isDisabled2" class="confirm" @click="confirm">确定</button>
	</div>
</template>

<script>
	import topBar from '../../../components/topBarSec/index.vue'
	import { apiSmsCaptcha, apiVerificationCode } from '../../../request/api.js'; // 导入我们的api接口
	import { Toast } from 'vant';
	export default {
		name: 'personalData',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '绑定手机',
				phone: '', // 手机号码
				authCode: '', // 验证码
				authCodeBtn: '发送验证码', // 验证码按钮
				placeholder: '请输入手机号码', // 区分邮箱和手机号码
				totalTime: 61, // 倒计时总数
				isDisabled: false, //发送验证码按钮是否可以点击
				isDisabled2: false, //确定按钮是否可点击
				source: '', // 来源
				timer: null, // 倒计时
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
				_this.totalTime = 61;
				_this.authCodeBtn = '发送验证码';
			})
		},
		methods: {
			init() { // 初始化
				this.source = this.$route.query.source;
				this.source == 'phone' ? this.title = '绑定手机' : this.title = '绑定邮箱';
				this.source == 'phone' ? this.placeholder = '请输入手机号码' : this.placeholder = '请输入邮箱';
				this.authCode = '';
				this.phone = '';
			},
			countdown() { // 倒计时
				var _this = this;
				this.isDisabled = true;
				_this.timer = setInterval(() => {
					_this.totalTime--;
					_this.authCodeBtn = _this.totalTime + 's后重试';
					if(_this.totalTime == 0) {
						_this.isDisabled = false;
						clearInterval(_this.timer);
						_this.totalTime = 61;
						_this.authCodeBtn = '发送验证码';
					}
				}, 1000)
			},
			sendCode() { // 发送验证码
				var _this = this;
				if(this.source == 'phone') {
					if(!this.phone) {
						this.$layer.msg("请输入手机号码");
						return false;
					};
					if(!(/^1[3456789]\d{9}$/.test(this.phone))) {
						this.$layer.msg("请输入正确的手机号码");
						return false;
					};
				} else {
					if(!this.phone) {
						this.$layer.msg("请输入邮箱号");
						return false;
					};
					if(!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(this.phone))) {
						this.$layer.msg("请输入正确的邮箱号");
						return false;
					};
				}

				apiVerificationCode({
					param1: _this.phone
				}).then(res => {
					if(res.code == 0) {
						_this.$layer.msg('验证码发送成功');
						_this.countdown();
					} else {
						_this.$layer.msg(res.message)
					}
				})

			},
			confirm() { // 提交
				var _this = this;
				if(this.source == 'phone') {
					if(!this.phone) {
						this.$layer.msg("请输入手机号码");
						return false;
					};
					if(!(/^1[3456789]\d{9}$/.test(this.phone))) {
						this.$layer.msg("请输入正确的手机号码");
						return false;
					};
				} else {
					if(!this.phone) {
						this.$layer.msg("请输入邮箱号");
						return false;
					};
					if(!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(this.phone))) {
						this.$layer.msg("请输入正确的邮箱号");
						return false;
					};
				}

				if(!this.authCode) {
					this.$layer.msg("请输入验证码");
					return false;
				}

				apiSmsCaptcha({
					phoneOrMail: _this.phone,
					smsCaptcha: _this.authCode,
				}).then(res => {
					if(res.code == 0) {
						Toast.success('绑定成功');
						setTimeout(function() {
							Toast.clear();
							_this.$router.push({
								path: '/account'
							});
						}, 1800)
					} else {
						_this.$layer.msg(res.message)
					}
				})

			}
		}
	}
</script>

<style lang="less" scoped>
	.bindPhone {
		.listBox>li {
			width: 9.06rem;
			height: 1.44rem;
			background: rgba(237, 237, 237, 0);
			border-radius: 8px;
			border: 1px solid rgba(168, 168, 168, 1);
			margin: 0.35rem auto;
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
				position: relative;
				border-right: 1px solid #ccc;
			}
			.authCode:after {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				height: 1.1rem;
				width: 0;
				border-left: solid darkblue 1px;
				z-index: 999;
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
			display: block;
		}
	}
</style>