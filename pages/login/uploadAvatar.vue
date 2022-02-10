<template>
	<view class="bodyMain">
		<view class="flex-space-around  uploadBox">
			<view class="avatarBox flex-center">
				<text class="title">{{$t('uploadAvatar.avatar')}}</text>
				<view class="flex-center avatar" v-if="avatar.length">
					<image class="m-icon" :src="avatar[0]" @click="seeAvatar" mode="aspectFill"></image>
				</view>
				<view class="flex-center userIcon avatar" v-else>
					<u-icon name="account-fill" />
				</view>
				<text>{{$t('uploadAvatar.info')}}</text>
			</view>
			<u-button v-if="!avatar.length" shape="circle" class="m-btn pink uploadBtn" @click="selectAvatar"
				hover-class="none">{{$t('uploadAvatar.btnText')}}</u-button>
			<u-button v-else shape="circle" class="m-btn pink uploadBtn" @click.stop="regSuccess" hover-class="none">
				{{$t('uploadAvatar.regDown')}}
			</u-button>
		</view>
		<view class="textBox flex-center">
			<text>Privacy & terms</text>
			<text class="center">Need help?</text>
			<text>© 2021 91Uber</text>
		</view>
	</view>
</template>

<script>
	import {
		uploadFile
	} from '@/common/js/filerequest.js'
	export default {
		data() {
			return {
				avatar: [], // 选择的图片列表
				uploadAvatar: undefined, //上传之后图片地址
			};
		},
		methods: {
			selectAvatar() {
				// 选择头像
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					success: e => {
						this.avatar = e.tempFilePaths;
						uploadFile({
							url: this.$api.imgUpload,
							filePath: e.tempFilePaths[0],
							name: 'file',
							formData: {
								'folderPath': 'danners'
							},
							loading: true,
							success: (res) => {
								that.uploadAvatar = 'https://' + res.result;
							},
							fail: (err) => {
								uni.showToast({
									title: this.$t('login.avatarUploadFailed'),
									icon: 'none',
									success() {
										that.avatar = [];
									}
								})
							}
						});
					}
				});
			},
			regSuccess() {
				if (!this.uploadAvatar) {
					const that = this
					return uni.showToast({
						title: this.$t('login.avatarUploadFailed'),
						icon: 'none',
						success() {
							that.avatar = []
						}
					})
				}
				this.$http.put(this.$api.updateStoreInfo, {
					'avatar': this.uploadAvatar
				}).then(res => {
					uni.showToast({
						title:this.$t('login.regSuccess'),
						success() {
							setTimeout(() => {
								uni.switchTab({
									url: '../heart/heart'
								})
							}, 1500)
						}
					})
				})
			},
			seeAvatar() {
				// 查看头像
				uni.previewImage({
					urls: this.avatar,
					success: e => {
						console.log('当前查看的图片：', e);
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped src="./css/uploadAvatar.scss"></style>
