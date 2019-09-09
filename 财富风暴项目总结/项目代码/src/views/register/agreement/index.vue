<template>
	<div class="agreement">
		<topbar :title="this.title"></topbar>
		<div class="agreementBox">
			<h3>特别提示</h3>
			<p>本协议是您（也成“用户”）与博思梦想文化传播有限公司（下称“博思文化”）之间就财富风暴平台网站及APP（下称“财富风暴”或财富风暴平台”）相关服务所订立的协议。您使用财富风暴平台服务即视为您已阅读并同意接受本协议的约束。</p>
			<h3>1.使用规则</h3>
			<p>用户在使用财富风暴平台服务中的所有行为应遵守国家法律、法规、规章、规范性文件等规定及本协议的规定和要求，不违背社会公德，不损害国家或者任何第三人的任何合法权益。否则，产生的一切法律后果均由用户独立承担，并应确保博思文化免于承担任何责任。</p>
			<h3>2.风险提示</h3>
			<p>无论用户基于何种理由，博思文化都不承担因用户使用平台服务而引起的任何直接或间接损失或损害的法律责任。</p>
			<h3>3.礼券性质及其使用</h3>
			<p>财富风暴平台上提供的礼券或任何类似礼券的折扣券或优惠券等，都是不具有任何现金价值、不可转让且只能在指定的有效期内使用的非现金券。用户购买财富风暴平台的产品或服务时可以使用礼券。在产品或服务的退货、退订时，礼券不予退还。礼券不能兑换为现金或现金等价物。</p>
			<h3>4.用户的违约及处理</h3>
			<p>博思文化有最终决定权自主决定对用户的违约进行处罚。</p>
			<h3>5.版权说明</h3>
			<p>用户接受本协议，即表明用户自愿将其在财富风暴平台上发表的任何形式的信息的著作财产权无偿永久的独家转让给博思文化。</p>
			<h3>6.隐私信息的保护</h3>
			<p>在您使用财富风暴平台上的服务时，您同意博思文化</p>
			<h3>7.法律适用、管辖与其他</h3>
			<p>本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律。因本协议产生之争议，以博思文化注册地有管辖权的法院管辖。博思文化对本协议、财富风暴平台上的任何声明有最终解释权与修改权。</p>
		</div>
	</div>
</template>

<script>
	import topBar from '../../../components/topBarSec/index.vue'
	export default {
		name: 'agreement',
		data() {
			return {
				title: '注册协议',
			}
		},
		components: {
			topbar: topBar
		},
		methods: {}
	}
</script>

<style lang="less" scoped>
	.agreement {
		.agreementBox {
			padding: 0.42rem 0.37rem;
			padding-left: 0.5rem;
			text-align: left;
			color: #333333;
			h3 {
				font-size: 14px;
				font-family: PingFangSC-Semibold;
				font-weight: bold;
				color: rgba(102, 102, 102, 1);
				line-height: 20px;
			}
			p {
				font-size: 14px;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 23px;
			}
		}
	}
</style>