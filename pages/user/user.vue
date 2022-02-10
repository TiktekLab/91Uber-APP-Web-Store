<template>
	<view class="bodyMain bodyBG">
		<u-navbar title="个人中心" :is-back="false" :border-bottom="false" />
		<view class="userInfo flex-start" @click="navigateTo('./userInfo/userInfo')">
			<view class="avatar flex-center">
				<u-image class="m-icon" id="avatar" :src="storeInfo.avatar || avatarUrl(storeInfo.id)" width="130"
					height="130" shape="circle" mode="aspectFill" />
			</view>
			<view class="info flex-space-between">
				<view class="left flex">
					<view>
						<text class="name">{{ storeInfo.name }}</text>
						<text>UID：{{ storeInfo.serialNumber || '' }}</text>
					</view>
					<view class="flex-start"><text class="count">当前待完成预约：{{orderCount}}</text></view>
				</view>
				<view class="right flex-end">
					<u-icon name="arrow-right" color="#C7C7CC" />
				</view>
			</view>
		</view>
		<!-- 我的钱包 -->
		<view class="balance m-radius flex-space-between" @click="navigateTo('./recharge/recharge')">
			<view class="flex-start">
				<text>我的钱包：</text>
				<text class="strong">{{ formatPrice(storeInfo.balance) }}</text>
			</view>
			<view class="flex-start">
				<text class="Recharge">前往充值</text>
				<u-icon name="arrow-right" color="#FFFFFF" />
			</view>
		</view>

		<view class="itemBox">
			<view class="item flex-space-between">
				<view class="left flex-start">
					<text class="iconfont icon">&#xe623;</text>
					<text>工作人数</text>
				</view>
				<view class="right flex-end"><text class="black">{{staffCount}}</text></view>
			</view>
			<view class="item flex-space-between">
				<view class="left flex-start">
					<text class="iconfont icon">&#xe620;</text>
					<text>总关注人数</text>
				</view>
				<view class="right flex-end"><text class="black">{{storeFollowCount}}</text></view>
			</view>
			<view class="item flex-space-between" @click="navigateTo('./userOrderList/userOrderList')">
				<view class="left flex-start">
					<text class="iconfont icon">&#xe624;</text>
					<text>查看订单</text>
				</view>
				<view class="right flex-end">
					<u-icon name="arrow-right" color="#C7C7CC" />
				</view>
			</view>
			<view class="item flex-space-between" @click="navigateTo('./contactUs/contactUs')">
				<view class="left flex-start">
					<text class="iconfont icon">&#xe61f;</text>
					<text>联系我们</text>
				</view>
				<view class="right flex-end">
					<u-icon name="arrow-right" color="#C7C7CC" />
				</view>
			</view>
		</view>
		<u-modal v-model="isShowModal" confirm-text="取消" @cancel="ShowModal" title="尚未开放" content="功能尚未开发，敬请期待" />
		<!-- 自定义tabBar -->
		<tabBar :active="2" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import moment from "moment";
	import tabBar from "@/component/tabBar/tabBar.vue";
	export default {
		components: {
			tabBar
		},
		onLoad() {
			uni.hideTabBar();
		},	
		onShow() {			
			this.getStoreFollowCount();
			this.orderFinishedCount();
		},
		data() {
			return {
				isShowModal: false, // 是否显示弹框
				orderCount: undefined,
				storeFollowCount: undefined,
			};
		},
		computed: {
			...mapState({
				storeInfo: state => state.storeInfo,
				staffCount: state => state.staffCount,
			})
		},
		methods: {
			...mapMutations(["emptyUserInfo"]),
			orderFinishedCount() { //已完成订单数量
				this.$http.get(this.$api.notFinished).then(res => {
					this.orderCount = res.count;
				});
			},
			getStoreFollowCount() { //关注人数
				this.$http.get(this.$api.storeFollowCount).then(res => {
					this.storeFollowCount = res.count;
				});
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			ShowModal() {
				this.isShowModal = !this.isShowModal;
			},
		}
	};
</script>

<style lang="scss" scoped src="./css/user.scss"></style>
