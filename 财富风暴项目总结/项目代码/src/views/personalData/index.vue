<template>
	<div class="personalData">
		<topbar :title="this.title"></topbar>
		<ul class="list personalBox">
			<li class="modHead">
				<div>头像</div>
				<div>
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload><i class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="modJob">
				<div>职业</div>
				<div>{{job}}<i class="fa fa-angle-right arrow-right"></i></div>
			</li>

			<li @click="modUserName">
				<div>昵称</div>
				<div>{{userName}}<i class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="modEducation">
				<div>学历</div>
				<div>{{education}}<i class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="modSex">
				<div>性别</div>
				<div>{{sex}}<i class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="modBirthday">
				<div>生日</div>
				<div>{{birthday}}<i class="fa fa-angle-right arrow-right"></i></div>
			</li>
		</ul>
		<van-action-sheet v-model="educationShow" :actions="educations" @select="educationSelect" />
		<van-action-sheet v-model="sexShow" :actions="sexs" @select="sexSelect" />

		<van-popup v-model="birthdayShow" position="bottom" :style="{ height: '30%' }">
			<van-datetime-picker @confirm='confirmPicker' @cancel="cancelPicker" v-model="currentDate" type="date" :min-date="minDate" />
		</van-popup>

		<van-dialog v-model="jobShow" title="请填写职业" show-cancel-button :before-close='beforeCloseJob'>
			<input v-model="jobInput" class="jobValue" type="text" name="" id="" value="" placeholder="请输入职业" />
		</van-dialog>

		<van-dialog v-model="userNameShow" title="请填写昵称" show-cancel-button :before-close='beforeCloseNick'>
			<input v-model="userNameInput" class="jobValue" type="text" name="" id="" value="" placeholder="请输入昵称" />
		</van-dialog>
	</div>
</template>

<script>
	import { apiGetmember, apiMember, apiUploadPic } from '../../request/api.js'; // 导入我们的api接口
	import axios from 'axios';
	import topBar from '../../components/topBarSec/index.vue'
	import Vue from 'vue';
	import { Popup, DatetimePicker, Dialog, Toast, ActionSheet } from 'vant';
	Vue.use(ActionSheet).use(DatetimePicker).use(Popup).use(Dialog);
	export default {
		name: 'personalData',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '个人资料',
				imageUrl: require("../../assets/imgs/my/my-logo.png"), // 头像
				jobShow: false, // 职业
				job: '', // 职业
				jobInput: '', // 职业
				userNameShow: false, // 昵称
				userName: '', // 昵称
				userNameInput: '', // 昵称
				currentDate: new Date(), // 生日
				minDate: new Date(1900, 0, 1), // 日期最小选择日期
				birthday: '未填写', // 生日
				birthdayShow: false, // 生日
				educationShow: false, // 学历
				education: '未填写', // 学历
				educations: [{
					name: '博士'
				}, {
					name: '硕士'
				}, {
					name: '本科'
				}, {
					name: '专科'
				}, {
					name: '高中'
				}],
				sexShow: false,
				sex: '未填写', // 性别，0男1女2保密
				sexs: [{
					name: '男',
					id: '0'
				}, {
					name: '女',
					id: '1'
				}],
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init() { // 初始化
				var _this = this;
				this.userNameInput = '';
				this.jobInput = '';
				apiGetmember({}).then(res => {
					if(res.code == 0) {
						let data = res.data;
						_this.imageUrl = window.alyun + data.memberHeadPicUrl;
						data.memberEducation ? _this.education = data.memberEducation : _this.education = '未填写';
						data.memberNickName ? _this.userName = data.memberNickName : _this.userName = '未填写';
						data.memberBirthday ? _this.birthday = data.memberBirthday.split(' ')[0] : _this.birthday = '未填写';
						data.memberCareer ? _this.job = data.memberCareer : _this.job = '未填写';
						if(data.memberBirthday) {
							_this.currentDate = new Date(data.memberBirthday.split('-')[0], data.memberBirthday.split('-')[1] - 1, data.memberBirthday.split('-')[2].split(' ')[0]);
						}
						if(data.memberSex || data.memberSex == 0) {
							if(data.memberSex == 0) {
								_this.sex = '男';
							} else {
								data.memberSex == 1 ? _this.sex = '女' : _this.sex = '保密'
							}
						} else {
							_this.sex = '未填写';
						}
					} else {
						_this.$layer.msg(res.message)
					}
				})
			},

			beforeCloseJob(action, done) { // 修改职业
				var _this = this;
				if(action === 'confirm') {
					if(!this.jobInput) {
						this.$layer.msg('请填写职业');
						done(false);
						return false;
					}
					this.job = this.jobInput;
					apiMember({
						memberCareer: this.job
					}).then(res => {
						if(res.code == 0) {
							done();
							Toast.success('修改成功');
							setTimeout(function() {
								Toast.clear();
							}, 1800)
						} else {
							_this.$layer.msg(res.message);
							done(false);
						}
					})

				} else {
					_this.jobInput = '';
					done();
				}
			},
			beforeCloseNick(action, done) { // 修改昵称
				var _this = this;
				if(action === 'confirm') {
					if(!this.userNameInput) {
						this.$layer.msg('请填写昵称');
						done(false);
						return false;
					};
					if(this.userNameInput.length > 20) {
						this.$layer.msg('昵称字数不能超过20个字');
						done(false);
						return false;
					};
					this.userName = this.userNameInput;
					apiMember({
						memberNickName: this.userName
					}).then(res => {
						if(res.code == 0) {
							done();
							Toast.success('修改成功');
							setTimeout(function() {
								_this.userName = _this.userNameInput;
								Toast.clear();
							}, 1800)
						} else {
							_this.$layer.msg(res.message);
							done(false);
						}
					})
				} else {
					_this.userNameInput = '';
					done();
				}
			},
			beforeAvatarUpload(file) { // 上传头像
				var _this = this;
				var fd = new FormData();
				fd.append('file', file);
				fd.append('type', 'header-icon');
				apiUploadPic(fd).then(res => {
					if(res.code == 0) {
						var memberHeadPicUrl = res.data;
						_this.imageUrl = memberHeadPicUrl;
						_this.modInfo({
							memberHeadPicUrl: memberHeadPicUrl
						});
					} else {
						_this.$layer.msg(res.message);
						return false;
					}
				})
			},
			modJob() {
				this.jobShow = true;
			},
			modUserName() {
				this.userNameShow = true;
			},
			modEducation() {
				this.educationShow = true;
			},
			modBirthday() { // 修改生日
				this.birthdayShow = true;
			},
			educationSelect(item) { // 修改学历
				this.education = item.name;
				this.modInfo({
					memberEducation: item.name
				});
				this.educationShow = false;
			},
			modSex() { // 修改性别
				this.sexShow = true;
			},
			sexSelect(item) {
				this.sex = item.name;
				this.modInfo({
					memberSex: item.id
				});
				this.sexShow = false;
			},
			confirmPicker(value) { // 生日
				this.birthday = this.getDate(value);
				this.modInfo({
					memberBirthday: this.birthday
				});
				this.birthdayShow = false;
			},
			cancelPicker() {
				this.birthdayShow = false;
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			getDate(item) {
				var time = new Date(item)
				var year = time.getFullYear()
				var month = time.getMonth() + 1
				var date = time.getDate()
				return year + '-' + this.add0(month) + '-' + this.add0(date)
			},
			modInfo(data) {
				var _this = this;
				apiMember(data).then(res => {
					if(res.code == 0) {
						Toast.success('修改成功');
						if(data.memberHeadPicUrl) {
							_this.imageUrl = window.alyun + data.memberHeadPicUrl;
						}
						setTimeout(function() {
							Toast.clear();
						}, 1800)
					} else {
						_this.$layer.msg(res.message);
						return false;
					}
				})
			},

		}
	}
</script>

<style lang="less" scoped>
	.van-dialog {
		width: 70%;
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
		margin-top: 0.65rem;
		margin-bottom: 0.48rem;
	}
	
	.personalData {
		.personalBox>.modHead {
			height: 2.88rem;
			line-height: 2.88rem;
			div:last-child {
				.arrow-right {
					top: 1.04rem;
				}
				img {
					height: 1.39rem;
					width: 1.39rem;
					border-radius: 50%;
					position: absolute;
					top: 0.745rem;
					right: 0.69rem;
				}
			}
		}
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
	}
</style>