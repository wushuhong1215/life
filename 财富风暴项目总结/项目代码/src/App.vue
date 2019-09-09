<template>
	<div id="app">
		<transition>
			<keep-alive>
				<router-view v-cloak></router-view>
			</keep-alive>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'app',
	}
</script>
<style lang="less">
	@media screen and (min-width: 500px) {
		/*处理媒体和商品TV端*/
		.video-content-box {
			padding: 0.45rem 0.26rem;
			padding-top: 0;
			overflow: hidden;
			li:nth-child(2n) {
				padding: 12px 5px 10px 5px;
			}
			li:nth-child(2n-1) {
				padding: 12px 5px 10px 5px;
			}
			.video-content-wrap {
				width: 25%;
				float: left;
				border-bottom: 1px solid #D8D8D8;
				.video-box {
					width: 100%;
					height: 2.88rem;
					display: flex;
					align-items: center;
					overflow: hidden;
					position: relative;
					.video-time {
						/*height: 0.82rem;*/
						/*line-height: 0.82rem;*/
						padding:4px 5px;
						width: 2.18rem;
						color: rgba(255, 255, 255, 0.7);
						font-size: 16px;
						text-align: center;
						background: rgba(0, 0, 0, 0.4);
						position: absolute;
						bottom: 0;
						right: 0;
					}
					img {
						width: 100%;
						justify-content: center;
					}
				}
				.video-detail {
					p:first-child {
						font-size: 16px;
						color: #666;
						height: 1.2rem;
						overflow: hidden;
						display: -webkit-box;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					p:last-child {
						font-size: 13px;
						color: #999;
						strong {
							color: #D41E26;
						}
					}
				}
			}
		}
		/*处理地址管理TV端*/
		.address-content-box {
			padding: 0.45rem 0.26rem;
			padding-top: 0;
			overflow: hidden;
			li:nth-child(2n) {
				padding: 12px 5px 10px 5px;
			}
			li:nth-child(2n-1) {
				padding: 12px 5px 10px 5px;
			}
			.address-content-wrap {
				width: 25%;
				float: left;
				border-bottom: 1px solid #D8D8D8;
				.addressBox {
					width: 100%;
					height: 3.22rem;
					border-radius: 4px;
					background: rgba(29, 206, 255, 0.1);
					position: relative;
					float: left;
					.detailBox {
						padding: 10px 6px;
						p:first-child {
							color: #999999;
							line-height: 0.7rem;
							strong {
								padding-right: 10px;
								font-size: 16px;
								color: #666666;
								display: block;
								float: left;
								width: 75px;
								height: 26px;
								overflow: hidden;
							}
						}
						p:last-child {
							width: 100%;
							height: 1.4rem;
							overflow: hidden;
							display: -webkit-box;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
							color: #666;
							font-size: 12px;
							span {
								padding-right: 5px;
								color: #46D7FF;
							}
						}
					}
					.editAddress {
						width: 100%;
						background: rgba(29, 206, 255, 1);
						text-align: center;
						color: #fff;
						border: none;
						outline: none;
						font-size: 13px;
						line-height: 0.7rem;
						border-radius: 0 0 4px 4px;
						position: absolute;
						bottom: 0;
					}
				}
			}
		}
	}
	
	@media screen and (max-width: 500px) {
		/*处理媒体和商品TV端*/
		.video-content-box {
			padding: 0.45rem 0.26rem;
			padding-top: 0;
			overflow: hidden;
			li:nth-child(2n) {
				padding: 12px 0 10px 5px;
			}
			li:nth-child(2n-1) {
				padding: 12px 5px 10px 0;
			}
			.video-content-wrap {
				width: 50%;
				float: left;
				border-bottom: 1px solid #D8D8D8;
				.video-box {
					width: 100%;
					height: 2.88rem;
					display: flex;
					align-items: center;
					overflow: hidden;
					position: relative;
					.video-time {
						/*height: 0.82rem;*/
						/*line-height: 0.82rem;*/
						padding: 5px;
						width: 2.18rem;
						color: rgba(255, 255, 255, 0.7);
						font-size: 16px;
						text-align: center;
						background: rgba(0, 0, 0, 0.4);
						position: absolute;
						bottom: 0;
						right: 0;
					}
					img {
						width: 100%;
						justify-content: center;
					}
				}
				.video-detail {
					p:first-child {
						font-size: 16px;
						color: #666;
						height: 1.2rem;
						overflow: hidden;
						display: -webkit-box;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					p:last-child {
						font-size: 13px;
						color: #999;
						strong {
							color: #D41E26;
						}
					}
				}
			}
		}
		/*处理地址管理TV端*/
		.address-content-box {
			padding: 0.45rem 0.26rem;
			padding-top: 0;
			overflow: hidden;
			li:nth-child(2n) {
				padding: 12px 0 10px 5px;
			}
			li:nth-child(2n-1) {
				padding: 12px 5px 10px 0;
			}
			.address-content-wrap {
				width: 50%;
				float: left;
				border-bottom: 1px solid #D8D8D8;
				.addressBox {
					width: 100%;
					height: 3.22rem;
					border-radius: 4px;
					background: rgba(29, 206, 255, 0.1);
					position: relative;
					float: left;
					.detailBox {
						padding: 10px 6px;
						p:first-child {
							color: #999999;
							line-height: 0.7rem;
							strong {
								padding-right: 10px;
								font-size: 16px;
								color: #666666;
								display: block;
								float: left;
								width: 75px;
								height: 26px;
								overflow: hidden;
							}
						}
						p:last-child {
							width: 100%;
							height: 1.4rem;
							overflow: hidden;
							display: -webkit-box;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
							color: #666;
							font-size: 12px;
							span {
								padding-right: 5px;
								color: #46D7FF;
							}
						}
					}
					.editAddress {
						width: 100%;
						background: rgba(29, 206, 255, 1);
						text-align: center;
						color: #fff;
						border: none;
						outline: none;
						font-size: 13px;
						line-height: 0.7rem;
						border-radius: 0 0 4px 4px;
						position: absolute;
						bottom: 0;
					}
				}
			}
		}
	}
	
	[v-cloak] {
		display: none;
	}
	
	.btnBg {
		background-color: linear-gradient(135deg, #2ccffd 0%, #16cdff 100%, #2ccefe 100%);
	}
	
	.clicked {
		background-color: #17A4CB!important;
	}
	
	.el-message-box__wrapper .el-message-box {
		width: 80%!important;
	}
	
	.ivu-switch-checked {
		border-color: #18CDFF!important;
		background-color: #18CDFF!important;
	}
	/*我的订单*/
	
	.ivu-tabs-nav {
		width: 100%;
	}
	
	.ivu-tabs-mini .ivu-tabs-tab {
		width: 20%;
		text-align: center;
		padding: 16px 16px!important;
		font-size: 16px!important;
		font-weight: 500;
	}
	
	.ivu-tabs-nav .ivu-tabs-tab:hover {
		color: #1DCEFF!important;
	}
	
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #1DCEFF!important;
	}
	
	.ivu-tabs-ink-bar {
		background-color: #1DCEFF!important;
	}
	/*end*/
	
	.fl {
		float: left;
	}
	
	.rl {
		float: right;
	}
	
	input::input-placeholder {
		color: #ccc!important;
	}
	/* 有些资料显示需要写，有些显示不需要，但是在编辑器webstorm中该属性不被识别 */
	
	::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #ccc!important;
	}
	
	:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		color: #ccc!important;
	}
	
	::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: #ccc!important;
	}
	
	:-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: #ccc!important;
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
</style>