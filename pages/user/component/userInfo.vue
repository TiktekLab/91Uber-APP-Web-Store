<template>
	<view class="staffInfoBox">
		<view class="staffInfo flex-start">
			<view class="avatar flex-center" @click="selectAvatar"><image class="m-icon" :src="staffInfo.avatar" mode="aspectFill"></image></view>
			<view class="info flex-space-between">
				<view class="top flex">
					<text class="name">{{ staffInfo.username }}</text>
					<text class="count flex-center">{{ $t('staffDetails.id') }}: {{ staffInfo.serialNumber }}</text>
					<text class="rate flex-start">
						{{ $t('staffDetails.Review') }}: {{ staffInfo.score || '0' }}
						<text class="iconfont icon">&#xe642;</text>
					</text>
				</view>
				<view class="bottom flex-start">
					<text class="timer m-radius flex-center">{{ $t('staffDetails.Total') }}: {{ staffInfo.totalWorkMinute | totalWorkHours }} {{ $t('staffDetails.Hour') }}</text>
					<text class="state m-radius flex-center">
						{{ $t('staffDetails.staffState') }}: {{ statusText(staffInfo.status) }}
						<!-- 工作中：pink
						空闲中：green
						已下线：gray -->
						<text :class="['iconfont', 'icon', statusColor(staffInfo.status)]">&#xe601;</text>
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		staffInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		selectAvatar: {
			type:Function,
		}
	},
	computed: {
		statusText() {
			return status => {
				switch (status) {
					case 0:
						return this.$t('staffDetails.Disabled');
					case 1:
						return this.$t('staffDetails.working');
					case 2:
						return this.$t('staffDetails.Available');
					case 3:
						return this.$t('staffDetails.Reserved');
				}
			};
		}
	},
	filters: {
		statusText(status) {
			switch (status) {
				case 0:
					return '已下线';
				case 1:
					return '工作中';
				case 2:
					return '空闲中';
				case 3:
					return '已预约';
			}
			return '';
		},
		totalWorkHours(totalWorkMinute) {
			//计算总工时，0.5小时制
			if (!totalWorkMinute || totalWorkMinute <= 0) {
				return 0;
			}
			let hours = Math.floor(totalWorkMinute / 60);
			let odd = totalWorkMinute % 60;
			let oddHours = odd === 0 ? 0 : odd <= 30 ? 0.5 : 1;
			return hours + oddHours;
		}
	},
	methods: {
		statusColor(status) {
			switch (status) {
				case 0:
					return 'gray';
				case 1:
					return 'pink';
				case 2:
					return 'green';
				case 3:
					return 'order';
			}
			return 'gray';
		}
	}
};
</script>

<style lang="scss" scoped>
.staffInfoBox {
	padding: 40rpx;
	overflow: hidden;
	.staffInfo {
		.avatar {
			width: 100rpx;
			height: 100rpx;
			flex: 0 0 100rpx;
			image{
				border-radius: 50%;
				overflow: hidden;
			}
		}

		.info {
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			min-height: 100rpx;
			flex: 1;
			overflow: hidden;
			margin-left: 20rpx;

			.top {
				flex-wrap: wrap;
				text {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.name {
					font-size: 36rpx;
					margin-right: 40rpx;
					max-width: 540rpx;
					
				}

				.rate {
					font-size: 22rpx;

					.icon {
						font-size: 22rpx;
						color: #ffc107;
						margin-left: 10rpx;
					}
				}

				.count {
					margin-right: 40rpx;
					font-size: 22rpx;
				}
			}

			.bottom {
				flex-wrap: wrap;
				width: 100%;
				text {
					// width: 50%;
					// flex: 1;
					margin: 5rpx 0;
					font-size: 22rpx;
					padding: 10rpx 20rpx;
					height: 40rpx;
					box-sizing: border-box;
					line-height: 1;

					&.timer {
						background-color: $pink;
						color: $white;
						margin-right: 20rpx;
					}

					&.state {
						background-color: $white;
						color: #000;

						.icon {
							padding: 0;
							font-size: $font-size-base;

							// 状态样式
							&.pink {
								color: $font-color-pink;
							}

							&.gray {
								color: $font-color-gray;
							}

							&.green {
								color: $success;
							}
						}
					}
				}
			}
		}
	}
}
</style>
