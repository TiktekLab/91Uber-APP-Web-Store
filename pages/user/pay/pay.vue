<template>
	<view class="bodyMain ">
		<u-navbar title="保证金充值" v-if="!isPaySuccess"/>
		<u-navbar title="充值成功" v-else/>
		<view class="moneyBg">
			<view class="flex-center money m-radius">
				<text>{{ formatPrice(cardForm.amt) }}</text>
				<text class="btn flex-center" v-if="!isPaySuccess">当前余额：{{ storeInfo.balance ? formatPrice(storeInfo.balance) : "$0.00" }}</text>
				<text class="btn flex-center" v-else>押金充值成功</text>
			</view>
		</view>

		<view class="cardBox" v-if="!isPaySuccess">
			<view class="shadow">
				<image class="cardIcon" v-if="cardTypeInfo.cardIcon" :src="cardTypeInfo.cardIcon"></image>
				<text class="txt" v-if="cardTypeInfo.cardType">{{ cardTypeInfo.cardType }}</text>
			</view>
			<view class="shadow"><input v-model="cardForm.cardNumber" class="input" type="number" placeholder="请输入卡号" /></view>
			<view class="flex-space-between three">
				<view class="shadow item"><input class="input" v-model="cardForm.expMonth" type="number" placeholder="有效期MM" /></view>
				<view class="shadow item"><input class="input" v-model="cardForm.expYear" type="number" placeholder="有效期YY" /></view>
				<view class="shadow item"><input class="input" v-model="cardForm.cvc" type="number" placeholder="安全码" /></view>
			</view>
		</view>
		<!-- 充值成功 -->
		<view class="Recharge flex-center" v-else><u-image class="UberIcon" width="255rpx" height="221rpx" src="@/static/icon/91Uber.png" mode="aspectFill" /></view>
		<view class="Tips padding">
			<text>
				温馨提示：
				<br />
				<!-- 银行会收取2%的手续费。
				<br />
				首次充值金额必须大于排班人数x100澳币的总和。
				<br />
				接单后，若商家在订单开始前一小时内取消预约，扣除$50保证金，大于1小时不扣钱。
				<br />
				如有任何疑问，请联系我们的在线客服。 -->
				接单后，若商家在订单开始前一小时内取消预约，扣除$50保证金；若订单开始前一小时外取消预约，不扣除$50保证金。
			</text>
		</view>
		<view :class="['PreciseSearch padding absoluteBtn', { isAndroid: isAndroid }]">
			<u-button hover-class="none" plain class="searchBtn  pink  m-btn" :loading="payloading" :disabled="payloading" @click="confirmPay">{{ isPaySuccess ? "返回我的余额" : "确认支付AU$"+cardForm.amt }}</u-button>
		</view>
		<!--  3D验证  -->
		<web-view
			v-if="stripeShow"
			ref="webview"
			class="web-view"
			:src="validUrl"
			@message="handleMessage"
			:style="{ width: systemInfo.windowWidth, height: systemInfo.windowHeight }"
		></web-view>
	</view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { updateStoreInfo } from "@/common/js/storeCommon.js";
export default {
	data() {
		return {
			cardForm: {
				cardNumber: "",
				expMonth: "",
				expYear: "",
				cvc: "",
				amt: undefined,
				paymentMethodId: undefined,
				paymentIntentId: undefined,
			},
			systemInfo: {},
			validUrl: undefined,
			stripeShow: false,
			payloading: false,
			isPaySuccess: false
		};
	},
	computed: {
		cardTypeInfo() {
			//0.VISA Card 1.Master Card
			if (this.cardForm.cardNumber) {
				if (this.cardForm.cardNumber.indexOf("4") === 0) {
					return {
						cardType: "Visa Card",
						cardIcon: "../../../static/icon/visa.png"
					};
				} else if (this.cardForm.cardNumber.indexOf("5") === 0) {
					return {
						cardType: "Master Card",
						cardIcon: "../../../static/icon/card.png"
					};
				}
			}
			return {};
		},
		...mapState({
			storeInfo: state => state.storeInfo,
		})
	},
	onLoad(option) {
		this.systemInfo = uni.getSystemInfoSync();
		this.cardForm.amt = option.payMoney;
	},
	methods: {
		confirmPay() {
			if (this.isPaySuccess) {
				// 充值成功就返回上一页
				return uni.navigateBack();
			}
			if (!this.cardForm.cardNumber) {
				return uni.showToast({
					title: "请输入卡号",
					icon: "none"
				});
			}
			if (this.cardForm.cardNumber.trim().length < 10 || this.cardForm.cardNumber.trim().length > 16) {
				return uni.showToast({
					title: "请输入16位数字卡号",
					icon: "none"
				});
			}
			if (!this.cardForm.expMonth || !this.cardForm.expYear) {
				return uni.showToast({
					title: "请输入卡号有效期",
					icon: "none"
				});
			}
			if (this.cardForm.expMonth.trim().length > 2) {
				return uni.showToast({
					title: "有效期月份2位数字",
					icon: "none"
				});
			}
			if (this.cardForm.expYear.trim().length !== 2) {
				return uni.showToast({
					title: "有效期年份2位数字",
					icon: "none"
				});
			}
			if (!this.cardForm.cvc) {
				return uni.showToast({
					title: "请输入安全码",
					icon: "none"
				});
			}
			if (this.cardForm.cvc.trim().length !== 3) {
				return uni.showToast({
					title: "安全码3位数字",
					icon: "none"
				});
			}
			if (this.cardForm.expMonth.trim().length === 1) {
				this.cardForm.expMonth = "0" + this.cardForm.expMonth;
			}
			this.payAction();
		},
		payAction() {
			this.payloading = true;
			this.$http.post(this.$api.paymentDeposit, this.cardForm).then(res => {
					this.payloading = false;
					const { scriptJs, paymentIntentId, isVerify } = res;
					this.cardForm.paymentIntentId = paymentIntentId;
					if (isVerify) {
						uni.showLoading({
							mask: true
						});
						this.validUrl = "/hybrid/html/paySecure.html" + scriptJs.match(/\?[\d|\D]*/);
						this.stripeShow = true;
					} else {
						updateStoreInfo();
						this.stripeShow = false;
						this.isPaySuccess = true;
						uni.showToast({
							title: "保证金充值成功",
							icon: "none",
							duration: 1500
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				}).catch(err => {
					this.cardForm.paymentIntentId = undefined;
					this.payloading = false;
				});
		},
		handleMessage(evt) {
			// 监听webView返回数据.
			console.log("evt", evt);
			const res = evt.detail.data[0];
			switch (res.code) {
				case 0:
					uni.hideLoading();
					break;
				case 1:
					this.paySecure(res.data);
					break;
			}
		},
		paySecure(data) {
			// 处理验证结果
			this.stripeShow = false;
			if (data.paymentIntent) {
				// 验证通过 二次验证
				this.payAction();
			} else {
				this.cardForm.paymentIntentId = undefined;
				// 失败 提示错误信息
				uni.showToast({
					title: data.error.message,
					icon: "none"
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped src="../css/pay.scss"></style>
