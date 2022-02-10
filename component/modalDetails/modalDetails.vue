<template>
	<u-mask :show="visible">
		<view class="warp ">
			<view class="modalBox ">
				<view class="top flex-center">
					<view class="avatar">
						<image class="m-icon" :src="orderDetailsInfo.memberAvatar" mode="aspectFill"></image>
					</view>
					<text class="name">{{orderDetailsInfo.memberName}}</text>
					<view class="closeIcon">
						<u-icon name="close" @click="modalClose" />
					</view>
				</view>
				<view class="timeBox" v-if="orderDetailsInfo.orderType === 0">
					<view class="startTime Time">
						<text class="iconfont green">&#xe601;</text>
						<text>{{orderDetailsInfo.startTime|timeFormat}}</text>
					</view>
					<view class="endTIme Time">
						<text class="iconfont pink">&#xe601;</text>
						<text>{{orderDetailsInfo.endTime|timeFormat}}</text>
					</view>
				</view>
				<view class="timeBox" v-else></view>
				<text class="aboutTxt" v-if="orderDetailsInfo.orderType === 1">{{ $t('orderList.ContactInfo') }}：</text>
				<view class="address flex" v-if="orderDetailsInfo.orderType === 0">
					<text>{{orderDetailsInfo.employeeName}}</text>
					<text class="dizhi">{{showAddress}}</text>
				</view>
				<view class="address flex outAddress" v-else>
					<text>{{ $t('orderList.ContactPhone') }}：</text>
					<text class="phoneTxt">{{orderDetailsInfo.receiverPhone}}</text>
					<text>{{ $t('orderList.ContactAddress') }}：</text>
					<text class="dizhi">{{ orderDetailsInfo.receiverAddress }}</text>
				</view>
				<view class="btnGroup flex-end" v-if="orderDetailsInfo.orderType === 0">
					<!-- 禁用：disable 不可用：btn 可用：pink -->
					<!-- 0已下单 1店铺已接单 2确认到达 3店铺已发送详细地址 4开始工作 5结束工作 6订单取消 -->
					<text class="btn" v-if="orderDetailsInfo.status>0 && orderDetailsInfo.status<4"
						@click.stop="$noMultipleClicks(cancelOrder)">{{ $t('orderList.CancelOrder') }}</text>
					<text class="btn disable"
						v-if="orderDetailsInfo.status===1">{{ $t('orderList.FuzzyAddress') }}</text>
					<text class="btn pink" v-if="orderDetailsInfo.status===2"
						@click.stop="$noMultipleClicks(sendFullAddress)">{{ $t('orderList.SendFullAddress') }}</text>
					<text class="btn pink" v-if="orderDetailsInfo.status===3"
						@click.stop="$noMultipleClicks(orderBegin)">{{ $t('orderList.OrderStart') }}</text>
					<text class="btn pink" v-if="orderDetailsInfo.status===4"
						@click.stop="$noMultipleClicks(orderComplete)">{{ $t('orderList.OrderEnd') }}</text>
				</view>
				<!-- OutCall 订单 -->
				<view class="btnGroup flex-end" v-else>
					<text class="btn pink" @click="modalClose" v-if="orderDetailsInfo.status===6"
					      >{{ $t('orderList.confirm') }}</text>
					<text class="btn pink" v-if="orderDetailsInfo.status===1"
						@click.stop="$noMultipleClicks(orderComplete)">{{ $t('orderList.OrderEnd') }}</text>
						
				</view>
			</view>
		</view>
	</u-mask>
</template>

<script>
	import moment from 'moment';
	export default {
		props: {
			visible: {
				type: Boolean,
				required: true
			},
			orderDetailsInfo: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		filters: {
			timeFormat(time) {
				return moment(time?.replace('T', ' ')).format('DD/MM/YYYY HH:mm');
			}
		},
		data() {
			return {
				noClick: true, //重复点击				
			};
		},
		computed: {
			showAddress() { //显示地址类型
				if (this.orderDetailsInfo) {
					let status = this.orderDetailsInfo.status;
					if (status !== 6) {
						return status < 3 ? this.$t('orderList.Fuzzy') + this.orderDetailsInfo.receiverVagueAddress : this
							.$t('orderList.Full') + this
							.orderDetailsInfo.receiverAddress
					} else {
						if (this.orderDetailsInfo.receiverAddress) {
							return this.$t('orderList.Full') + this.orderDetailsInfo.receiverAddress
						}
						return this.$t('orderList.Fuzzy') + this.orderDetailsInfo.receiverVagueAddress;
					}
				}
				return undefined;
			}
		},
		methods: {
			cancelOrder() { //店铺取消订单
				this.$http.post(this.$api.orderCancel(this.orderDetailsInfo.id)).then(res => {
					this.refreshData()
					uni.showToast({
						title: this.$t('orderList.OrderCancelled'),
						icon: 'none',
						duration: 1000
					})
					setTimeout(() => {
						this.modalClose()
					}, 1000)
				})
			},
			sendFullAddress() { //店铺发送完整地址
				this.$http.post(this.$api.sendFullAddress(this.orderDetailsInfo.id)).then(res => {
					this.refreshData()
					uni.showToast({
						title: this.$t('orderList.SentSuccess'),
						icon: 'none',
						duration: 1000
					})
					setTimeout(() => {
						this.modalClose()
					}, 1000)
				})
			},
			orderBegin() { //订单开始开始工作
				this.$http.post(this.$api.orderBegin(this.orderDetailsInfo.id)).then(res => {
					this.refreshData()
					uni.showToast({
						title: this.$t('orderList.StartSuccess'),
						icon: 'none',
						duration: 1000
					})
					setTimeout(() => {
						this.modalClose()
					}, 1000)
				})
			},
			orderComplete() { //订单结束
				this.$http.post(this.$api.orderComplete(this.orderDetailsInfo.id)).then(res => {
					this.refreshData()
					uni.showToast({
						title: this.$t('orderList.endSuccess'),
						icon: 'none',
						duration: 1000
					})
					setTimeout(() => {
						this.modalClose()
					}, 1000)
				})
			},
			modalClose() {
				this.$emit("modalClose", {
					isClose: true
				});
			},
			refreshData() {
				this.$emit("refreshData", {
					isRefresh: true
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

		.modalBox {
			width: 600rpx;
			border-radius: 10rpx;
			padding: 0 60rpx 60rpx;
			background-color: #fff;

			.top {
				position: relative;
				flex-direction: column;

				.avatar {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					overflow: hidden;
					-webkit-transform: rotate(0deg);
					margin-top: -80rpx;
					flex: 0 0 160rpx;
				}

				.name {
					font-size: 36rpx;
					font-family: 'PingFangSCBold';
				}

				.closeIcon {
					position: absolute;
					right: -20rpx;
					top: 30rpx;
				}
			}

			.timeBox {
				margin: 40rpx 0;

				.Time {
					margin: 10rpx 0;

					text {
						font-size: 24rpx;
						color: $font-color-gray;

						&.green {
							color: $success;
						}

						&.pink {
							color: $pink;
						}
					}
				}
			}

			.aboutTxt {
				font-size: 24rpx;
				margin-bottom: 30rpx;
				display: flex;
			}

			.address {
				flex-direction: column;
				background-color: rgba(239, 246, 249, .5);
				padding: 10rpx;
				border-radius: 10rpx;
				overflow: hidden;

				text {
					font-size: 24rpx;
					line-height: 1.5;
					// &.dizhi{
					// 	-webkit-line-clamp: 3;
					// 	overflow: hidden;
					// 	display: -webkit-box;
					// 	-webkit-box-orient: vertical;
					// }
				}

				&.outAddress {
					padding: 10rpx 20rpx;

					.phoneTxt {
						margin-bottom: 20rpx;
					}
				}
			}

			.btnGroup {
				margin: 40rpx -15rpx 0;
				flex-wrap: wrap;

				.btn {
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #D3D3D3;
					border-radius: 6rpx;
					font-size: $font-size-base;
					margin: 10rpx 10rpx 10rpx 0;
					padding: 5rpx 15rpx;
					min-width: 120rpx;

					&.pink {
						background-color: $pink;
					}

					&.disable {
						background-color: #FFAAC8;
					}

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
