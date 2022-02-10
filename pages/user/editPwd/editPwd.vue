<template>
	<view class="bodyMain">
		<u-navbar title="修改密码" :border-bottom="false" />
		<u-form :model="editPwd" :error-type="['toast']" ref="editPwd" class="form padding" label-width="200">
			<u-form-item label="请输入电话" :border-bottom="false" prop="phone">
				<text class="prefix">+61</text><input v-model="editPwd.phone" placeholder="请输入手机号" type="number" />
			</u-form-item>
			<u-form-item label="验证码" :border-bottom="false" prop="code">
				<input v-model="editPwd.code" placeholder="请输入验证码" type="number" />
				<u-button slot="right" hover-class="none" class="getCode pink m-btn" size="mini" @click="getCode">{{ codeTips }}</u-button>
			</u-form-item>
			<u-form-item label="密码" :border-bottom="false" prop="pwd">
				<input v-model="editPwd.pwd" placeholder="请输入密码" :type="isShowPwd[0].type ? 'text' : 'password'" />
				<text class="iconfont eye" @click="switchType(0)">{{ isShowPwd[0].type ? '&#xe68e;' : '&#xe68d;' }}</text>
			</u-form-item>
			<u-form-item label="确认密码" :border-bottom="false" prop="confirmPwd">
				<input v-model="editPwd.confirmPwd" placeholder="请重新输入密码" :type="isShowPwd[1].type ? 'text' : 'password'"  />
				<text class="iconfont eye" @click="switchType(1)">{{ isShowPwd[1].type ? '&#xe68e;' : '&#xe68d;' }}</text>
			</u-form-item>
		</u-form>
		<view :class="['PreciseSearch padding absoluteBtn', { isAndroid: isAndroid }]">
			<u-button hover-class="none" plain class="searchBtn  pink  m-btn" @click="savePwd">保存新密码</u-button>
		</view>
		<u-modal v-model="isShowModal" @confirm="Confirm" title="保存成功" confirm-text="返回" content="您的新密码已保存" />

		<u-verification-code seconds="60" ref="uCode" @change="codeChange" />
	</view>
</template>

<script>
const rules = require("@/common/js/rules.js"); // 表单校验

export default {
	onLoad() {
		this.editPwd.phone = uni.getStorageSync("storeInfo").phone;
	},
	data() {
		return {
			rules, // 表单校验
			editPwd: {
				phone: undefined,
				code: undefined,
				pwd: undefined,
				confirmPwd: undefined
			},
			isShowPwd: [{type:false},{type:false}],
			isShowModal: false, // 是否显示弹框
			codeTips: "" // 发送验证码状态
		};
	},
	onReady() {
		const data = {
			validator: (rule, value, callback) => {
				return value === this.editPwd.pwd;
			},
			message: "两次输入的密码不一致！",
			trigger: ["change", "blur"]
		};
		if (this.rules.confirmPwd.length > 1) {
			this.rules.confirmPwd.splice(1, 1, data);
		} else {
			this.rules.confirmPwd.push(data);
		}
		this.$refs.editPwd.setRules(this.rules);
	},
	methods: {
		switchType(index) {
			this.isShowPwd[index].type = !this.isShowPwd[index].type
		},
		codeChange(text) {
			this.codeTips = text;
		},
		getCode() {
			// 获取验证码
			if (this.$refs.uCode.canGetCode) {
				uni.showLoading({
					title: "正在获取验证码",
					mask: true
				});
				this.$http
					.post(
						this.$api.sendRestCode,
						{ phone:  '0' + this.editPwd.phone },
						{
							header: {
								number: this.$base.authNumber
							},
							load: true,
							tokenRequired: false
						}
					)
					.then(res => {
						uni.hideLoading();
						this.$u.toast("验证码已发送");
						this.$refs.uCode.start();
						console.log("验证码：", res);
					});
			} else {
				this.$u.toast("倒计时结束后再发送");
			}
		},
		Confirm() {
			uni.navigateBack({
				delta: 1
			});
		},
		savePwd() {
			// 保存新密码
			this.$refs.editPwd.validate(res => {
				if (res) {
					const data = {...this.editPwd};
					data.phone = '0' + data.phone;
					this.$http
						.post(this.$api.resetPwd, data, {
							load: true,
							header: {
								number: this.$base.authNumber
							},
							tokenRequired: false
						})
						.then(res => {
							this.isShowModal = true;
							uni.removeStorageSync("logout");	
							uni.removeStorageSync("saveLoginStore");
						});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped src="../css/editPwd.scss"></style>
