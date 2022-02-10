<template>
	<view class="bodyMain bodyBG ">
		<u-navbar :title="$t('setUp.switchLang')" />
		<view class="setting">
			<view class="itemBox">
				<view class="item flex-space-between" @click="Language === 'en' && setLang('zh')">
					<text>中文</text>
					<u-icon name="checkmark" v-if="Language === 'zh'" />
				</view>
				<view class="item flex-space-between" @click="Language === 'zh' && setLang('en')">
					<text>English</text>
					<u-icon name="checkmark" v-if="Language === 'en'" />
				</view>
			</view>
		</view>
		<u-modal v-model="isShowModal" :title="$t('showToast.Notice')" @confirm="confirmSwitch" :cancel-text="$t('orderList.cancel')"
			:confirm-text="$t('orderList.confirm')" show-cancel-button confirm-color="#f1598e" :content="$t('showToast.SetLang')">
		</u-modal>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.Language = uni.getStorageSync('language')
		},
		data() {
			return {
				Language: undefined,
				isShowModal: false,
				lang: undefined,
			};
		},
		methods: {
			setLang(e) { // 设置语言
				this.isShowModal = !this.isShowModal;
				this.lang = e;
			},
			confirmSwitch() {
				if (this.lang === this.Language) {
					return
				}
				uni.removeStorageSync('language');
				this.$i18n.locale = this.lang;
				this.Language = this.lang;
				console.log('当前语言：', this.lang);
				uni.setStorageSync('language', this.lang);
				uni.$emit("setMescrollGlobalOption", {
					i18n: {
						type: this.lang
					}
				}); // 下拉刷新组件国际化配置
				// plus.runtime.restart();
				plus.runtime.quit();
				// uni.showToast({
				// 	title:this.$t('showToast.switchLangRes'),
				// 	icon: 'none'
				// })
			},

		}
	};
</script>

<style lang="scss" scoped>
	.setting {
		height: calc(100vh - var(--status-bar-height) - 44px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.item {
			margin: 20rpx 0;
			padding: 30rpx;

			&:first-child {
				border-bottom: 2rpx solid #EAEAEA;
			}

			text {
				font-size: 28rpx;
			}
		}

	}
</style>
