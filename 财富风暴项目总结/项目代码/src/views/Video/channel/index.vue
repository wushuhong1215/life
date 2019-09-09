<template>
	<div class="channel">
		<div class="topBar">
			<span @click="cancelSelect">取消</span>
			<h2>资讯频道</h2>
		</div>
		<div class="channelList">
			<ul>
				<li v-for="item in channelList">
					<a href="javascript:;" :id='item.videoTypeName' @click="channelSelected">{{item.videoTypeName}}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { apiVideoTypes } from '../../../request/api.js';
	export default {
		name: 'channel',
		data() {
			return {
				channelList: [], // 频道列表
				active: null, // 返回的active
			}
		},
		activated() {
			this.init();
		},
		methods: {
			init() { // 初始化
				var _this = this;
				apiVideoTypes({}).then(res => { // 获取导航标签
					if(res.code == 0) {
						_this.channelList = res.data;
					} else {
						_this.$layer.msg(res.message)
					}
				});
			},
			channelSelected(value) { // 频道选择
				for(let i = 0; i < this.channelList.length; i++) {
					if(value.target.id == this.channelList[i].videoTypeName) {
						this.active = i;
					}
				}
				this.$router.push({
					path: '/video',
					query: {
						videoCate: value.target.id,
						source: 'channel',
						active: this.active,
					}
				});

			},
			cancelSelect() { // 取消频道选择
				this.$router.push({
					path: '/video',
				});
			},
		}

	}
</script>

<style lang="less">
	.channel {
		.channelList {
			padding: 0.06rem 0.32rem;
			ul {
				overflow: hidden;
				li {
					width: 16.666%;
					float: left;
					margin-top: 0.5rem;
					display: flex;
					a {
						padding: 0.19rem 0.2rem;
						height: 0.85rem;
						border: 1px solid #E4E4E4;
						text-align: center;
						font-size: 13px;
						color: #666666;
						margin: 0 auto;
						overflow: hidden;
					}
				}
			}
		}
		.topBar {
			height: 1.33rem;
			width: 100%;
			background: linear-gradient(135deg, rgba(49, 172, 255, 1) 0%, rgba(22, 205, 255, 1) 100%, rgba(44, 206, 254, 1) 100%);
			color: #fff;
			text-align: center;
			position: relative;
			line-height: 1.33rem;
			span {
				position: absolute;
				left: 0.69rem;
				font-size: 17px;
			}
			h2 {
				font-size: 20px;
			}
		}
	}
</style>