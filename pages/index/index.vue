<template>
	<view :class="['bodyMain', { signUp: swiperCurrent }]" @touchstart="start" @touchend="end">
		<view class="bg"></view>
		<view class="main">
			<view class="logo">
				<!-- <image class="m-icon" src="@/static/icon/loginIcon.png" mode="aspectFill" /> -->
			</view>
			<view :class="['title flex', { isLogin: swiperCurrent }]">
				<text :class="[{ active: swiperCurrent }]" @click="swiperCurrent = true">登录</text>
				<text class="register-but" :class="[{ active: !swiperCurrent }]" @click="swiperCurrent = false">注册</text>
			</view>
			<view class="formBox">
				<u-form :model="loginData" :error-type="['toast']" ref="loginForm" :class="['form', { isSignUp: swiperCurrent }]" label-position="top">
					<u-form-item label="电话" prop="username">
						<text class="prefix loginWhite">+61</text><input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="loginData.username" placeholder="输入电话号码" type="number" />
					</u-form-item>
					<u-form-item label="密码" prop="password">
						<input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="loginData.password" placeholder="输入密码" :type="isShowPwd[0].type ? 'text' : 'password'" />
						<text class="iconfont eye loginWhite" @click="switchType(0)">{{ isShowPwd[0].type ? "&#xe68e;" : "&#xe68d;" }}</text>
					</u-form-item>
					<view class="savePwd flex-space-between">
						<view class="footer  flex-center" @click="saveLogin = !saveLogin">
							<view class="circle flex-center"><u-icon name="checkmark" size="40" v-if="saveLogin" color="#FFFFFF" /></view>
							<text class="circleInfo savePwdLable">记住密码</text>
						</view>
						<text class="Forget flex-center" @click="navigateTo">忘记密码?</text>
					</view>
					<u-button hover-class="none" @click="login" plain class="login pink m-btn">下一步</u-button>
					<view class="footer  flex-start" @click="isLogin = !isLogin">
						<view class="circle flex-center"><u-icon name="checkmark" size="40" v-if="isLogin" color="#FFFFFF" /></view>
						<text class="circleInfo law">我已满18周岁，并已满足当地法律法规许可规定</text>
					</view>
					<text class="welcome flex">Welcome to 91Uber for Business</text>
				</u-form>

				<u-form :model="signUpData" :error-type="['toast']" ref="signUpForm" :class="['form', { isSignUp: !swiperCurrent }]" label-position="top">
					<u-form-item label="昵称" prop="name"><input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="signUpData.name" placeholder="请输入昵称" type="text" /></u-form-item>
					<u-form-item label="手机号" prop="phone">
						<text class="prefix loginWhite">+61</text><input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="signUpData.phone" placeholder="请输入手机号" type="number" />						
					</u-form-item>
					<u-form-item label="验证码" prop="code">
						<input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="signUpData.code" placeholder="请输入验证码" type="number" />
						<u-button slot="right" hover-class="none" class="getCode login m-btn" size="mini" @click="getCode">{{ codeTips }}</u-button>
					</u-form-item>
					<u-form-item prop="email" class="email">
						<view class="inputLable flex-start">
							<text class="lable flex">邮箱</text>
							<text class="lable flex tips">(注册真实邮箱可收到最新行业数据)</text>
						</view>
						<input class="input loginWhite width" placeholder-style="color:rgb(192, 196, 204)" v-model="signUpData.email" placeholder="请重新输入邮箱" />
					</u-form-item>
					<u-form-item label="密码" prop="pwd">
						<input class="input loginWhite" placeholder-style="color:rgb(192, 196, 204)" v-model="signUpData.pwd" placeholder="请输入密码" :type="isShowPwd[1].type ? 'text' : 'password'" />
						<text class="iconfont eye loginWhite" @click="switchType(1)">{{ isShowPwd[1].type ? "&#xe68e;" : "&#xe68d;" }}</text>
						</u-form-item>
					<u-button hover-class="none" @click="signUp" plain class="signUpBtn login m-btn">下一步</u-button>
					<view class="footer  flex-start">
						<view class="circle flex-center" @click="agree = !agree"><u-icon name="checkmark" size="40" v-if="agree" color="#FFFFFF" /></view>
						<view>
							<text class="circleInfo" @click="agree = !agree">点击注册按钮即表示您已同意我们的</text>
							<text class="circleInfo" :href="href" @click="openURL">《91UBER 隐私政策》</text>
						</view>
					</view>
					<view class="footer  flex-start" @click="isSignUp = !isSignUp">
						<view class="circle flex-center"><u-icon name="checkmark" size="40" v-if="isSignUp" color="#FFFFFF" /></view>
						<text class="circleInfo law">我已满18周岁，并已满足当地法律法规许可规定</text>
					</view>
					<text class="welcome flex">Welcome to 91Uber for Business</text>
				</u-form>
			</view>
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
	</view>
</template>

<script>
import { mapMutations } from "vuex";
import { loginCall, refreshToken } from "@/common/js/common.js";
const rules = require("@/common/js/rules.js"); // 表单校验
export default {
	onReady() {
		this.$refs.loginForm.setRules(this.rules);
		this.$refs.signUpForm.setRules(this.rules);
	},
	data() {
		return {
			href:'https://www.91uber.com/legaldoc',
			rules, // 表单验证
			isShowPwd: [{ type: false }, { type: false }],
			swiperCurrent: true, // 当前的面板
			startData: {
				clientX: undefined,
				clientY: undefined
			},
			agree: false,
			saveLogin: false, // 是否记住密码
			loginData: {
				// 登录表单
				username: undefined,
				password: undefined
			},
			signUpData: {
				// 注册表单
				name: undefined,
				phone: undefined,
				code: undefined,
				avatar: undefined,
				email: undefined,
				pwd: undefined,
				confirmPwd: undefined
			},
			isLogin: false, // 登录满足法律许可
			isSignUp: false, // 注册满足法律许可
			codeTips: "" // 发送验证码状态
		};
	},
	onLoad() {
		const userData = uni.getStorageSync("saveLoginStore");
		if (userData) {
			Object.assign(this.loginData, userData);
			this.saveLogin = true;
		}
	},
	methods: {
		...mapMutations(["setUserInfo"]),
		codeChange(text) {
			// 发送验证码
			this.codeTips = text;
		},
		switchType(index) {
			this.isShowPwd[index].type = !this.isShowPwd[index].type;
		},
		openURL() {
			// #ifdef APP-PLUS
			plus.runtime.openURL(this.href)
			// #endif			
		},
		getCode() {
			// 获取验证码
			if (this.$refs.uCode.canGetCode) {
				uni.showLoading({
					title: "正在获取验证码",
					mask: true
				});
				this.$http.post( this.$api.sendCode, { phone: '0' + this.signUpData.phone }, { header: { number: this.$base.authNumber }, load: true, tokenRequired: false }).then(res => {
						uni.hideLoading();
						this.$u.toast("验证码已发送");
						this.$refs.uCode.start();
						//console.log("验证码：", res);
					});
			} else {
				this.$u.toast("倒计时结束后再发送");
			}
		},
		loginFun(data) {
			this.$http.post(this.$api.login + `?grant_type=${this.$base.grantType}`, data, {
					load: true,
					tokenRequired: false,
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: this.$base.authorization
					}
				}).then(res => {
					if (this.saveLogin) {
						uni.setStorageSync("saveLoginStore", this.loginData); // 记住密码
					} else {
						uni.removeStorageSync("saveLoginStore");
					}
					this.setUserInfo(res);
					loginCall();
					uni.removeStorageSync("logout");
					refreshToken();		
					uni.showToast({
						title: '登录成功',
						icon: "none",
						duration: 1500
					});
					setTimeout(() => {
						uni.switchTab({
							url: "../heart/heart"
						});
					}, 1500);
				}).catch(err => {
					this.loginData.password = '';
				})
		},
		login() {
			// 登录
			this.$refs.loginForm.validate(res => {
				if (res) {
					if (!this.isLogin) return this.$u.toast("请同意当地法律法规许可规定");
					let parameters = {
						username: '0' + this.loginData.username,
						password: this.loginData.password
					};
					this.loginFun(parameters);
				} else {					
					console.log("登录校验失败");
				}
			});
		},
		signUp() {
			// 注册
			this.$refs.signUpForm.validate(res => {
				if (res) {
					if (!this.agree) return this.$u.toast("请同意我们的隐私政策");
					if (!this.isSignUp) return this.$u.toast("请同意当地法律法规许可规定");
					const signData =  {...this.signUpData};
					signData.phone = '0' + signData.phone;
					this.$http.post(this.$api.register, signData, {
							load: true,
							header: { number: this.$base.authNumber},
							tokenRequired: false
						}).then(res => {
							let parameters = {
								username: signData.phone,
								password: signData.pwd
							};
							this.loginFun(parameters);
						});
				} else {
					console.log("注册校验失败");
				}
			});
		},
		navigateTo() {
			uni.navigateTo({
				url: "../login/forgetPwd"
			});
		},
		// 监听左右滑动:start
		start(e) {
			this.startData.clientX = e.changedTouches[0].clientX;
			this.startData.clientY = e.changedTouches[0].clientY;
		},
		end(e) {
			const subX = e.changedTouches[0].clientX - this.startData.clientX;
			const subY = e.changedTouches[0].clientY - this.startData.clientY;
			if (subY > 60) {
			} else if (subY < -60) {
			}
			if (subX > 60) {
				this.swiperCurrent = true;
			} else if (subX < -60) {
				this.swiperCurrent = false;
			}
		}
		// 监听左右滑动:end
	}
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
