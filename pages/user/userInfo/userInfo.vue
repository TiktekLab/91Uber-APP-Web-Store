<template>
	<view class="bodyMain hideScroll">
		<u-navbar title="个人信息" :border-bottom="false" />
		<view class="userItem padding">
			<view class="item flex-space-between " @click="isShowAction = true">
				<text class="left itemName">修改头像</text>
				<u-image width="120" height="120" shape="circle" :src="storeInfo.avatar || avatarUrl(storeInfo.id)"
					mode="aspectFill" />
			</view>
			<view class="item flex-space-between " @click="ShowModal(1)">
				<text class="left itemName">修改昵称</text>
				<text class="left itemName">{{ storeInfo.name }}</text>
			</view>
			<view class="item flex-space-between ">
				<text class="left itemName">手机号（不可修改）</text>
				<text class="left disable itemName">{{ formatPhone(storeInfo.phone) }}</text>
			</view>
			<view class="item flex-space-between " @click="ShowModal(2)">
				<text class="left itemName">修改邮箱</text>
				<text class="left itemName">{{ storeInfo.email || "立即绑定" }}</text>
			</view>
			<view class="item flex-space-between " @click="navigateTo">
				<text class="left itemName">修改密码</text>
				<text class="left itemName">******</text>
			</view>
			<view class="item flex-space-between " @click="ShowModal(3)">
				<text class="left itemName">退出登录</text>
				<u-icon name="arrow-right" color="#C7C7CC" />
			</view>
		</view>
		<u-modal v-model="isShowModal" show-cancel-button @cancel="ShowModal(false)" @confirm="modalConfirm"
			:title="modalTitle">
			<view v-if="modalType === 1" class="slot-content ">
				<text class="flex-center">请输入您的新昵称</text>
				<input v-model="modalData.name" class="input padding border" placeholder="请输入您的新昵称" />
			</view>
			<view v-if="modalType === 2" class="slot-content ">
				<text class="flex-center">请输入您的新邮箱</text>
				<input v-model="modalData.email"  class="input padding border"  placeholder="请输入您的新邮箱" />
			</view>
			<view v-if="modalType === 3" class="slot-content "><text class="flex-center">确定要退出此账号吗？</text></view>
		</u-modal>
		<u-action-sheet :list="list" @click="changeAction" safe-area-inset-bottom v-model="isShowAction" />
	</view>
</template>

<script>
	import { uploadFile } from "@/common/js/filerequest.js";
	import { mapState, mapMutations } from "vuex";
	import { updateStoreInfo } from "@/common/js/storeCommon.js";	
	import { WebSocketExit } from "@/common/js/webSocketPush.js";
	export default {
		onLoad() {
			this.modalData = Object.assign({}, this.storeInfo);
		},
		data() {
			return {
				isShowModal: false, // 是否显示modal
				modalType: undefined,
				modalTitle: undefined, // 弹框标题，
				modalData: {},
				isShowAction: false, // 时候显示action
				list: [{
					text: "拍摄",
					fontSize: 30
				}, {
					text: "从相册选取",
					fontSize: 30
				}, {
					text: "使用默认头像",
					fontSize: 30
				}],
				sourceType: "",
				avatar: undefined
			};
		},
		methods: {
			...mapMutations(["emptyUserInfo"]),
			ShowModal(e) {
				this.modalTitle = undefined;
				this.isShowModal = !this.isShowModal;
				if (e) {
					this.isModalType(e);
				}
			},
			changeAction(e) {
				if (e === 0) {
					this.sourceType = "camera";
				} else if (e === 1) {
					this.sourceType = "album";
				} else {
					return this.saveStoreInfo({
						avatar: ""
					});
				}
				this.selectAvatar();
			},
			isModalType(e) {
				this.modalType = Number(e);
				switch (e) {
					case 1:
						this.modalTitle = "修改昵称";
						break;
					case 2:
						this.modalTitle = "修改邮箱";
						break;
					case 3:
						this.modalTitle = "退出登录";
						break;
				}
			},
			modalConfirm() {
				// 弹框确认
				switch (this.modalType) {
					case 1:
						this.editNickName();
						break;
					case 2:
						this.editEmail();
						break;
					case 3:
						this.LogOut();
						break;
				}
			},
			editNickName() {
				if (this.modalData.name === "" || this.modalData.name === undefined) {
					this.$u.toast("昵称不能为空");
				} else if (this.modalData.name.length > 20) {
					this.$u.toast("昵称格式不规范");
				} else {
					this.saveStoreInfo({
						name: this.modalData.name
					});
				}
				this.modalData.name = this.storeInfo.name;
			},
			editEmail() {
				if (this.modalData.email === "" || this.modalData.email === undefined) {
					this.$u.toast("邮箱不能为空");
				} else if (!this.$base.mailRegular.test(this.modalData.email)) {
					this.$u.toast("邮箱格式不规范");
				} else {
					this.saveStoreInfo({
						email: this.modalData.email
					});
				}
				this.modalData.email = this.storeInfo.email;
			},
			LogOut() {
				// 退出登录
				if (this.userInfo.access_token) {
					this.$http.post(this.$api.loginOut, { access_token: this.userInfo.access_token }).then(res => {
							WebSocketExit();
							//this.emptyUserInfo();							
							uni.setStorageSync("logout","true");
							this.$u.toast(this.$t("showToast.exitRes"));
							setTimeout(() => {
								uni.reLaunch({
									url: "../../index/index"
								});
							}, 1000);
						});
				}
			},
			navigateTo() {
				uni.navigateTo({
					url: "../editPwd/editPwd"
				});
			},
			selectAvatar() {
				// 选择头像
				const that = this;
				uni.chooseImage({
					count: 1,
					sourceType: [this.sourceType],
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					success: e => {
						uploadFile({
							url: this.$api.imgUpload,
							filePath: e.tempFilePaths[0],
							name: "file",
							formData: {
								folderPath: "danners",
								fileType: 1
							},
							loading: true,
							success: res => {
								that.saveStoreInfo({
									avatar: "https://" + res.result
								});
							},
							fail: err => {
								this.$u.toast("头像修改失败");
							}
						});
					}
				});
			},
			saveStoreInfo(data) {
				// 保存商户信息
				this.$http.put(this.$api.updateStoreInfo, data).then(res => {
					this.modalData = Object.assign({}, data);
					updateStoreInfo(); // 获取店铺信息
					this.$u.toast("个人信息更新成功");
				});
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.userInfo,
				storeInfo: state => state.storeInfo,
			})
		}
	};
</script>

<style lang="scss" scoped src="../css/userInfo.scss"></style>
