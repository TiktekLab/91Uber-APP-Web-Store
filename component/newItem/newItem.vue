<template>
	<view class="newItem flex" @click="ItemEvent(100, itemIndex, ItemDetails.associateId)">
		<view class="avatar"><u-image class="m-icon" shape="circle" width="100" height="100" :src="ItemDetails.avatar || avatarUrl(14)" mode="aspectFill" /></view>
		<view class="itemInfo">
			<view class="nameBox flex-space-between">
				<text :class="['name', { strong: !ItemDetails.isRead }]">{{ ItemDetails.username }}</text>
				<text class="time">{{ ItemDetails.createTime | timeHmdm }}</text>
			</view>
			<view class="info flex-start">
				<!-- 未读消息添加 strong 样式 -->
				<text :class="['TwoLines', { strong: !ItemDetails.isRead }]">{{ ItemDetails.content }}</text>
			</view>
			<view v-if="ItemDetails.description" class="ExactAddress flex-start">
				<text class="address TwoLines">{{ ItemDetails.description }}</text>
			</view>
			<view v-if="showType === 0" class="btnGroup flex-end">
				<!-- 拒绝接单 -->
				<u-button v-if="ItemDetails.type === 14 && ItemDetails.status === 0" hover-class="none" plain class="btn plain m-btn" @click="ItemEvent(0, itemIndex, ItemDetails.associateId)">
					拒绝
				</u-button>
				<!-- 接受接单 -->
				<u-button v-if="ItemDetails.type === 14 && ItemDetails.status === 0" hover-class="none" plain class="btn pink m-btn" @click="ItemEvent(1, itemIndex, ItemDetails.associateId)">
					接受
				</u-button>
				<!-- 发送精确地址 -->
				<u-button v-if="ItemDetails.type === 15 && ItemDetails.status === 2" hover-class="none" plain class="btn pink m-btn" @click="ItemEvent(2, itemIndex, ItemDetails.associateId)">
					发送
				</u-button>
				<u-button v-if="ItemDetails.type === 14 && ItemDetails.status === 1" hover-class="none" plain class="btn disable m-btn">已接受</u-button>
				<u-button v-if="ItemDetails.type === 14 && ItemDetails.status === 6 && ItemDetails.cancelReason === 0" hover-class="none" plain class="btn disable m-btn">
					已拒绝
				</u-button>
				<!--接单请求类型的消息，接单前取消，接单后取消都显示已取消-->
				<u-button v-else-if="ItemDetails.type !== 4 && ItemDetails.type !== 6 && ItemDetails.type !== 12 && ItemDetails.status === 6 && ItemDetails.cancelReason !== 7" hover-class="none" plain class="btn disable m-btn">
					已取消
				</u-button>
				<u-button v-if="ItemDetails.type === 15 && ItemDetails.status === 3" hover-class="none" plain class="btn disable m-btn">已发送</u-button>
				<!-- 商家接单后，到了预定时间，客户未点击我已到达，显示灰色"开始服务" -->
				<u-button v-if="ItemDetails.type === 4 && ItemDetails.status === 1" hover-class="none" plain class="btn disable m-btn" @click="ItemEvent(3, itemIndex, ItemDetails.associateId)">
					开始服务
				</u-button>
				<!-- 商家接单后，到了预定时间，客户点击了我已到达，显示激活的"开始服务" -->
				<u-button v-if="ItemDetails.type === 4 && ItemDetails.status === 2" hover-class="none" plain class="btn pink m-btn" @click="ItemEvent(4, itemIndex, ItemDetails.associateId)">
					开始服务
				</u-button>
				<!-- 商家接单后，到了预定时间，客户未点击我已到达，订单取消了，显示灰色的"超时取消"-->
				<u-button v-if="ItemDetails.type === 4 && ItemDetails.status === 6" hover-class="none" plain class="btn disable m-btn">超时取消</u-button>
				<u-button v-if="ItemDetails.type === 3 && ItemDetails.status === 4" hover-class="none" plain class="btn pink m-btn" @click="ItemEvent(5, itemIndex, ItemDetails.associateId)">
					结束服务
				</u-button>
				<u-button v-if="ItemDetails.type === 3 && ItemDetails.status === 5" hover-class="none" plain class="btn disable m-btn">结束服务</u-button>
				<u-button v-if="ItemDetails.type === 10 && ItemDetails.status === 5 && !ItemDetails.score" hover-class="none" plain class="btn plain m-btn" @click="ItemEvent(8, itemIndex, ItemDetails.associateId)">
					前往评价
				</u-button>
				<u-button v-if="ItemDetails.type === 10 && ItemDetails.status === 5 && ItemDetails.score" hover-class="none" plain class="btn disable m-btn">
					已评价
				</u-button>
			</view>
			<view v-else class="btnGroup flex-end">
				<u-button v-if="ItemDetails.type === 1 && ItemDetails.putOffStatus === -1" hover-class="none" plain class="btn plain m-btn" @click="ItemEvent(6, itemIndex, ItemDetails.associateId)">
					拒绝
				</u-button>
				<u-button v-if="ItemDetails.type === 1 && ItemDetails.putOffStatus === -1" hover-class="none" plain class="btn pink m-btn" @click="ItemEvent(7, itemIndex, ItemDetails.associateId)">
					接受
				</u-button>
				<u-button v-if="ItemDetails.type === 1 && ItemDetails.putOffStatus === 1" hover-class="none" plain class="btn disable m-btn">已接受</u-button>
				<u-button v-if="ItemDetails.type === 1 && ItemDetails.putOffStatus === 0" hover-class="none" plain class="btn disable m-btn">已拒绝</u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		showType: {
			//0.订单请求，1.迟到请求
			type: [Number, String],
			require: false,
			default: null
		},
		itemIndex: {
			type: Number
		},
		ItemEvent: {
			type: Function
		},
		ItemDetails: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.newItem {
	padding: 30rpx;
	border-bottom: 2rpx solid #eee;

	&:last-child {
		border-bottom: 0;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		flex: 0 0 100rpx;

		image {
			border-radius: 50%;
			overflow: hidden;
		}
	}

	.itemInfo {
		margin-left: 20rpx;
		flex: 1;

		.TwoLines {
			// -webkit-line-clamp: 2;
			// overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			color: #a4a0a0;
			&.strong {
				font-weight: bold;
				color: #000;
			}
		}

		.nameBox {
			margin-bottom: 10rpx;

			text {
				margin: 0;
				line-height: 1;
				color: #a4a0a0;
				&.name {
					font-family: PingFangSCBold;
				}
				&.strong {
					color: #000;
				}
				&.time {
					color: #a4a0a0;
				}
			}
		}

		.info {
			margin: 20rpx 0 10rpx;
		}

		.ExactAddress {
			.address {
				color: #a4a0a0;
			}
		}

		.btnGroup {
			margin-top: 20rpx;

			.btn {
				width: 200rpx;
				height: 64rpx;
				margin: 0 0 0 30rpx;

				&:first-child {
					margin: 0;
				}

				&.plain {
					background-color: #fff;
					border: 2rpx solid $pink;
					color: $pink;
				}

				&.disable {
					background-color: #a4a0a0;
					color: #fff;
				}
			}
		}
	}
}
</style>
