<template>
	<view class="staffDetailsBox">
		<view v-if="staffDetails.id" class="flex-space-between staffDetails padding" @click="staffEvent(staffDetails.id, 2)">
			<u-image shape="circle" width="100" height="100" :src="staffDetails.avatar" mode="aspectFill" />
			<view class="flex-space-between info">
				<view class="left flex">
					<view class="flex-start">
						<text class="name">{{ staffDetails.username }}</text>
						<view class="rate flex-start">
							<text class="iconfont icon">&#xe642;</text>
							<text class="count">{{ staffDetails.score | scoreFormat() }}</text>
						</view>
					</view>
					<!-- <text>{{ staffDetails.phone }}</text> -->
				</view>
				<u-icon name="arrow-right" color="#C7C7CC" />
			</view>
		</view>
		<!-- <view class="flex-space-between staffDetails padding" @click="staffEvent(memberDetails.id,1)"> -->
		<view class="flex-space-between staffDetails padding">
			<u-image shape="circle" width="100" height="100" :src="memberDetails.avatar" mode="aspectFill" />
			<view class="flex-space-between info">
				<view class="left flex">
					<view class="flex-start">
						<text class="name">{{ memberDetails.nickName }}</text>
						<view class="rate flex-start">
							<text class="iconfont icon">&#xe642;</text>
							<text class="count">{{ memberDetails.score | scoreFormat() }}</text>
						</view>
					</view>
					<!-- <text>{{ memberDetails.boundPhone }}</text> -->
				</view>
				<u-icon name="arrow-right" color="#C7C7CC" />
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		staffDetails: { type: Object, default(){ return {} } },
		memberDetails: { type: Object },
		staffEvent: {
			type:Function
		}
	},
	
};
</script>

<style lang="scss" scoped>
.staffDetailsBox {
	background-color: f9f9f9;
	padding: 20rpx 0;
}
.staffDetails {
	height: 150rpx;
	background-color: #fff;

	.info {
		flex: 1;
		margin-left: 20rpx;
		.left {
			height: 100rpx;
			justify-content: space-around;
			align-items: flex-start;
			flex-direction: column;
			.name {
				font-family: PingFangSCBold;
			}
			.rate {
				margin-left: 20rpx;
				.icon {
					color: #ffd60a;
					font-size: 30rpx;
					margin-right: 10rpx;
				}
				.count {
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
