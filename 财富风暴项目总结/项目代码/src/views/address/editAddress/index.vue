<template>
	<div class="editAddress">
		<topbar :title="this.title"></topbar>
		<ul class="listBox">
			<li @click="modConsignee">
				<div>收货人</div>
				<div>{{consignee}}</div>
			</li>
			<li @click="modPhone">
				<div>手机号</div>
				<div>{{phone}}</div>
			</li>
			<li @click="modRegion">
				<div>选择地区</div>
				<div>{{addressAll}}<i class="fa fa-angle-right arrow-right"></i></div>
			</li>
			<li @click="modDetail">
				<div>详细地址</div>
				<div>{{detail}}</div>
			</li>
			<li>
				<div>设为默认</div>
				<div>
					<i-switch v-model="switch1" />
				</div>
			</li>
		</ul>
		<button class="confirm" @click="modAdress">修改</button>
		<button class="confirm delete" @click="deleteAdress">删除</button>

		<van-popup v-model="areaShow" position="bottom" :style="{ height: '30%' }">
			<van-picker :columns="columns" value-key="name" @change="onChange" show-toolbar @confirm="confirmArea" @cancel='cancelArea' />
		</van-popup>

		<van-dialog v-model="consigneeShow" title="请填写收货人" show-cancel-button :before-close='beforeCloseConsignee'>
			<input v-model="consigneeInput" class="jobValue" type="text" placeholder="请填写收货人" />
		</van-dialog>

		<van-dialog v-model="phoneShow" title="请填写手机号码" show-cancel-button :before-close='beforeClosePhone'>
			<input v-model="phoneInput" class="jobValue" type="text" placeholder="请填写手机号码" />
		</van-dialog>

		<van-dialog v-model="detailShow" title="请填写详细地址" show-cancel-button :before-close='beforeCloseDetail'>
			<input v-model="detailInput" class="jobValue" type="text" placeholder="请填写详细地址" />
		</van-dialog>
	</div>
</template>

<script>
	import { apiAddress, apiRegions, apiDeleteaddress } from '../../../request/api.js'; // 导入我们的api接口
	import topBar from '../../../components/topBarSec/index.vue'
	import { Dialog, Toast } from 'vant';
	export default {
		name: 'editAddress',
		components: {
			topbar: topBar
		},
		data() {
			return {
				title: '编辑地址',
				consigneeShow: false, // 收货人弹窗
				phoneShow: false, // 手机号弹窗
				detailShow: false, // 详细地址弹窗
				consignee: '收货人', // 收货人
				phone: '输入手机号', // 手机号
				detail: '详细地址', // 详细地址
				consigneeInput: '', // 收货人
				phoneInput: '', // 手机号
				detailInput: '', // 详细地址
				addressAll: '选择地址', // 全部地址
				switch1: false, // 默认开关
				areaShow: false, // 地区选择弹窗
				province: '', // 省
				city: '', // 市
				county: '', // 区
				provinceId: '', // 省id
				cityId: '', // 市id
				countyId: '', // 区id
				columns: [], // 省市区联动
				provinces: null,
				citys: null,
				countys: null,
				addressDefault: '', // 默认地址
			}
		},
		activated() {
			this.init();

			var _this = this;
			//---------省市区-------
			var provinces = [];
			var citys = {};
			var countys = {};
			var provinceId = '';
			var countyId = '';
			apiRegions({}).then(res => {
				if(res.code == 0) {// 处理省市区逻辑
					for(let i = 0; i < res.data.regions.length; i++) {
						var provinceObj = {};
						provinceObj.id = res.data.regions[i].id;
						provinceObj.name = res.data.regions[i].regionName;
						provinces.push(provinceObj)
						provinceObj = {};
						citys[res.data.regions[i].regionName] = [];
						if(_this.addressDefault.addressProvinceId == res.data.regions[i].id) {// 获取当前省
							_this.province = res.data.regions[i].regionName;
						}
						for(let j = 0; j < res.data.regions[i].children.length; j++) {
							var cityObj = {};
							cityObj.id = res.data.regions[i].children[j].id;
							cityObj.name = res.data.regions[i].children[j].regionName;
							citys[res.data.regions[i].regionName].push(cityObj);
							cityObj = {};
							countys[res.data.regions[i].children[j].regionName] = [];
							if(_this.addressDefault.addressCityId == res.data.regions[i].children[j].id) {// 获取当前市
								_this.city = res.data.regions[i].children[j].regionName;
							}
							for(let k = 0; k < res.data.regions[i].children[j].children.length; k++) {
								var countyObj = {};
								countyObj.id = res.data.regions[i].children[j].children[k].id;
								countyObj.name = res.data.regions[i].children[j].children[k].regionName;
								countys[res.data.regions[i].children[j].regionName].push(countyObj);
								countyObj = {};
								if(_this.addressDefault.addressAreaId == res.data.regions[i].children[j].children[k].id) {// 获取当前区
									_this.county = res.data.regions[i].children[j].children[k].regionName;
								}
							}

						}

					}
					for(let p = 0; p < provinces.length; p++) {// 获取省的默认位置
						if(provinces[p].name == _this.province) {
							provinceId = p;
						}
					}
					for(let u = 0; u < countys[_this.city].length; u++) {// 获取区的默认位置
						if(countys[_this.city][u].name == _this.county) {
							countyId = u;
						}
					}
					_this.columns.push({
						values: provinces,
						defaultIndex: provinceId,
						className: 'column1'
					})
					_this.columns.push({
						values: citys[_this.province],
						className: 'column2'
					})
					_this.columns.push({
						values: countys[_this.city],
						defaultIndex: countyId,
						className: 'column3'
					})

					_this.provinces = provinces;
					_this.citys = citys;
					_this.countys = countys;
				} else {
					_this.$layer.msg(res.message)
				}
			})
		},
		created() {  

		},

		methods: {
			init() { // 初始化
				this.addressDefault = this.$route.params;
				this.detail = this.addressDefault.addressDetail;
				this.phone = this.addressDefault.addressMobile;
				this.consignee = this.addressDefault.addressRecipient;
				this.addressAll = this.addressDefault.addressAll;
				this.addressId = this.addressDefault.addressId;
				this.provinceId = this.addressDefault.provinceId;
				this.cityId = this.addressDefault.cityId;
				this.countyId = this.addressDefault.countyId;
				this.province = this.addressDefault.province;
				this.city = this.addressDefault.city;
				this.county = this.addressDefault.county;
				this.addressDefault.addressState ? this.switch1 = true : this.switch1 = false;
				this.columns = [];
			},
			confirmArea(value) { // 选择省市区
				this.addressAll = '';
				this.province = value[0].name;
				this.provinceId = value[0].id;
				this.city = value[1].name;
				this.cityId = value[1].id;
				this.county = value[2].name;
				this.countyId = value[2].id;
				for(let i = 0; i < value.length; i++) {
					this.addressAll += value[i].name;
				}
				this.areaShow = false;
			},
			cancelArea() { // 取消选择
				this.areaShow = false;
			},
			onChange(picker, values, index) { // 省市区选择联动
				if(index == 0) {
					picker.setColumnValues(1, this.citys[values[0].name]);
					picker.setColumnValues(2, this.countys[this.citys[values[0].name][0].name]);
				} else if(index == 1) {
					picker.setColumnValues(2, this.countys[values[1].name]);
				}
			},
			beforeCloseConsignee(action, done) { // 收货人
				if(action === 'confirm') {
					if(!this.consigneeInput) {
						this.$layer.msg('联系人不能为空');
						done(false);
						return false;
					};
					if(this.consigneeInput.length > 20) {
						this.$layer.msg('收件人不能超过20个字');
						done(false);
						return false;
					};
					done(false);
					this.consignee = this.consigneeInput;
					this.consigneeShow = false;
				} else {
					done();
				}
			},

			beforeClosePhone(action, done) { // 手机号码
				if(action === 'confirm') {
					if(!this.phoneInput) {
						this.$layer.msg('手机号不能为空');
						done(false);
						return false;
					};
					if(!(/^1[3456789]\d{9}$/.test(this.phoneInput))) {
						this.$layer.msg('请输入正确的手机号码');
						done(false);
						return false;
					};
					done(false);
					this.phone = this.phoneInput;
					this.phoneShow = false;
				} else {
					done();
				}
			},

			beforeCloseDetail(action, done) { // 详细地址
				if(action === 'confirm') {
					if(!this.detailInput) {
						this.$layer.msg('请输入详细地址');
						done(false);
						return false;
					};
					if(this.detailInput.length < 5) {
						this.$layer.msg('详细地址不能少于5个字');
						done(false);
						return false;
					};
					if(this.detailInput.length > 200) {
						this.$layer.msg('详细地址不能超过200个字');
						done(false);
						return false;
					};
					done(false);
					this.detail = this.detailInput;
					this.detailShow = false;
				} else {
					done();
				}
			},
			modAdress() { // 添加地址
				var _this = this;
				if(this.consignee == '收货人') {
					this.$layer.msg('请填写收货人');
					return false;
				};
				if(this.phone == '输入手机号') {
					this.$layer.msg('请填写手机号码');
					return false;
				};
				if(this.detail == '详细地址') {
					this.$layer.msg('请填写详细地址');
					return false;
				};
				apiAddress({
					addressId: _this.addressId,
					addressRecipient: _this.consignee,
					addressProvinceId: _this.provinceId,
					addressCityId: _this.cityId,
					addressAreaId: _this.countyId,
					addressInfo: _this.detail,
					addressMobile: _this.phone,
					addressAll: _this.addressAll,
					addressState: _this.switch1,
				}).then(res => {
					if(res.code == 0) {
						Toast.success('修改成功');
						setTimeout(function() {
							Toast.clear();
							_this.$router.push({
								path: '/address',
								query: {
									source: 'newAdd'
								}
							});
						}, 1800)
					} else {
						_this.$layer.msg(res.message)
					}
				})

			},
			deleteAdress() { // 删除
				var _this = this;
				Dialog.confirm({
					title: '提示',
					message: '确定删除吗？'
				}).then(() => {
					apiDeleteaddress({
						param1: _this.addressDefault.addressId,
					}).then(res => {
						if(res.code == 0) {
							Toast.success('删除成功');
							setTimeout(function() {
								Toast.clear();
								_this.$router.push({
									path: '/address',
									query: {
										source: 'newAdd'
									}
								});
							}, 1800)
						} else {
							_this.$layer.msg(res.message);
						}
					})
				}).catch(() => {});

			},
			cancelArea() {
				this.areaShow = false;
			},
			modRegion() {
				this.areaShow = true;
			},
			modConsignee() {
				if(this.consignee != '收货人'){
					this.consigneeInput = this.consignee
				};
				this.consigneeShow = true;
			},
			modPhone() {
				if(this.phone != '输入手机号'){
					this.phoneInput = this.phone
				};
				this.phoneShow = true;
			},
			modDetail() {
				if(this.detail != '详细地址'){
					this.detailInput = this.detail
				};
				this.detailShow = true;
			},
		}
	}
</script>

<style lang="less" scoped>
	.editAddress {
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
		.delete {
			background: rgba(0, 0, 0, 0.5);
		}
		.listBox>li {
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