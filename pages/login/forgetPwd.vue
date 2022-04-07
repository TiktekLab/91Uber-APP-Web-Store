<template>
	<view class="bodyMain hideScroll">
		<u-navbar
			back-icon-name="arrow-leftward"
			title="忘记密码"
			:border-bottom="false"
			back-icon-size="36"
			title-color="#ffffff"
			back-icon-color="#ffffff"
			:background="{ background: 'transparent' }"
		/>
		<view class="bg"></view>
		<view class="main">
			<view class="registerForm">
				<u-form :model="formData" :error-type="['toast']" ref="regForm" class="form" label-position="top">
					<u-form-item label="电话" prop="phone">
						<text class="prefix loginWhite">+61</text><input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="formData.phone" placeholder="请输入手机号" type="number" />
					</u-form-item>
					<u-form-item label="验证码" prop="code">
						<input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="formData.code" placeholder="请输入验证码" type="number" />
						<u-button slot="right" hover-class="none" class="getCode login m-btn" size="mini" @click="getCode">{{ codeTips }}</u-button>
					</u-form-item>
					<u-form-item label="密码" prop="pwd">
						<input
							class="input loginWhite"
							placeholder-style="color:rgb(192, 196, 204)"
							v-model="formData.pwd"
							placeholder="请输入密码"
							:type="isShowPwd[0].type ? 'text' : 'password'"
						/>
						<text class="iconfont eye loginWhite" @click="switchType(0)">{{ isShowPwd[0].type ? "&#xe68e;" : "&#xe68d;" }}</text>
					</u-form-item>
					<u-form-item label="确认密码" prop="confirmPwd">
						<input
							class="input loginWhite"
							placeholder-style="color:rgb(192, 196, 204)"
							v-model="formData.confirmPwd"
							placeholder="请重新输入密码"
							:type="isShowPwd[1].type ? 'text' : 'password'"
						/>
						<text class="iconfont eye loginWhite" @click="switchType(1)">{{ isShowPwd[1].type ? "&#xe68e;" : "&#xe68d;" }}</text>
					</u-form-item>
				</u-form>
				<view :class="['PreciseSearch', { isAndroid: isAndroid }]">
					<u-button hover-class="none" @click="submit" plain class="submit login m-btn">确认并保存</u-button>
					<text class="flex-center welcome">Welcome to 91Uber for Business</text>
				</view>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange" />
	</view>
</template>

<script>
const rules = require("@/common/js/rules.js"); // 表单校验
export default {
	data() {
		return {
			rules,
			isShowPwd: [{ type: false }, { type: false }],
			formData: {
				phone: undefined,
				code: undefined,
				pwd: undefined,
				confirmPwd: undefined
			},
			codeTips: "" // 发送验证码状态
		};
	},
	onReady() {
		const data = {
			validator: (rule, value, callback) => {
				return value === this.formData.pwd;
			},
			message: "两次输入的密码不一致！",
			trigger: ["change", "blur"]
		};

		if (this.rules.confirmPwd.length > 1) {
			this.rules.confirmPwd.splice(1, 1, data);
		} else {
			this.rules.confirmPwd.push(data);
		}
		this.$refs.regForm.setRules(this.rules);
	},
	methods: {
		switchType(index) {
			this.isShowPwd[index].type = !this.isShowPwd[index].type;
		},
		deepClone(origin, target) {
			var target = target || {},
				toStr = Object.prototype.toString,
				arrStr = "[object Array]";
			for (let prop in origin) {
				if (origin.hasOwnProperty(prop)) {
					//判断是否为原型链上的属性，不是原型链上(非继承的属性)的属性时返回true
					if (origin[prop] !== "null" && typeof origin[prop] == "object") {
						//判断是否为原始值
						target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {};
						this.deepClone(origin[prop], target[prop]); // 继续返回引用值，当为原始值的时候结束
					} else {
						target[prop] = origin[prop]; // 当函数返回原始值的时候就结束此函数
					}
				}
			}
			return target;
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
				this.$http.post(this.$api.sendRestCode, { phone: "0" + this.formData.phone },
						{
							header: { number: this.$base.authNumber },
							load: true,
							tokenRequired: false
						}
					).then(res => {
						this.$u.toast("验证码已发送");
						this.$refs.uCode.start();
						console.log("验证码：", res);
					});
			} else {
				this.$u.toast("倒计时结束后再发送");
			}
		},
		submit() {
			// 重置密码
			this.$refs.regForm.validate(res => {
				if (res) {
					const data = {...this.formData};
					data.phone = "0" + data.phone;
					this.$http.post(this.$api.resetPwd, data, {
							load: true,
							header: {
								number: this.$base.authNumber
							},
							tokenRequired: false
						}).then(res => {
							this.$u.toast("密码重置成功");
							uni.removeStorageSync("logout");	
							uni.removeStorageSync("saveLoginStore");
							setTimeout(function() {
								uni.navigateTo({
									url: "../index/index"
								});
							}, 1000);
						});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped src="./css/forgetPwd.scss"></style>
