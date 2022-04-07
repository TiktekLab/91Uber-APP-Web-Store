<template>
	<view class="bodyMain">
		<u-navbar title="余额提现" />
		<view class="main padding">
			<u-form :model="refundForm" :error-type="['toast']" ref="refundForm" class="form" label-width="250" :label-style="{ fontSize: '26rpx', fontFamily: 'PingFangSCMedium',whiteSpace:'nowrap' }">
				<u-form-item label="提现金额*" prop="amount">
					<input v-model="refundForm.amount" type="number" class="input"  placeholder="请输入提现金额" />
				</u-form-item>
				<u-form-item label="Account name">
					<input v-model="refundForm.accountName" class="input"  placeholder="请输入账户名"  />
				</u-form-item>
				<u-form-item label="BSB">
					<input v-model="refundForm.bsb" class="input"  placeholder="请输入BSB" type="number"/>
				</u-form-item>
				<u-form-item label="Account number">
					<input v-model="refundForm.accountNumber" class="input"  placeholder="请输入卡号" type="number" />
				</u-form-item>
			</u-form>
			<text class="info flex-start">
				<u-icon name="error-circle" color="#992F65" size="26" />
				保证金将在3-7个工作日内退还
			</text>
		</view>
		<view class="PreciseSearch absoluteBtn"><u-button hover-class="none" plain class="searchBtn  pink  m-btn" @click="confirm">确认提现余额</u-button></view>
	</view>
</template>

<script>
import { mapState } from "vuex";
import { updateStoreInfo } from "@/common/js/storeCommon.js";
const rules = require("@/common/js/rules.js"); // 表单校验
export default {
	data() {
		return {
			rules, // 表单验证
			refundForm: {
				amount: undefined,
				accountName: undefined,
				bsb: undefined,
				accountNumber: undefined
			}
		};
	},
	onReady() {
		this.$refs.refundForm.setRules(this.rules);
	},
	computed: {
		...mapState({
			storeInfo: state => state.storeInfo,
		})
	},
	methods: {
		confirm() {
			this.$refs.refundForm.validate(res => {
				if (res) {
					if(parseFloat(this.refundForm.amount) > parseFloat(this.storeInfo.balance)){
						uni.showToast({
							title:"提现金额不能大于当前余额",
							icon:"none"
						})
						return;
					}
					const data = {
						amount: this.refundForm.amount,
						accountName: this.refundForm.accountName,
						bsb: this.refundForm.bsb,
						accountNumber: this.refundForm.accountNumber
					};
					this.$http.post(this.$api.bondRefund, data).then(res => {
						updateStoreInfo();
						uni.showToast({
							title: "提现申请已提交",
							success: () => {
								setTimeout(() => {
									uni.reLaunch({
										url: "../user"
									});
								}, 500);
							}
						});
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped src="../css/refund.scss"></style>
