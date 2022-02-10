<template>
	<view class="modalBox m-radius">
		<text class="titleName flex-start">{{ modalTitle(modalType) }}</text>
		<view class="main" v-if="modalType === 'figure'">
			<scroll-view scroll-y class="scrollView">
			<u-radio-group v-model="figureId" @change="radioChange" :wrap="true" active-color="#F1598E">
				<u-radio v-for="(item, index) in figureList" class="radio" :key="item.id" :name="item.id">
					{{ item.content }}
				</u-radio>
			</u-radio-group>
						</scroll-view>
		</view>
		<view class="main" v-else-if="modalType === 'serviceType'">
			<scroll-view scroll-y class="scrollView">
			<u-checkbox-group :wrap="true" active-color="#F1598E">
				<u-checkbox v-for="(item, index) in serviceList" class="checkbox " :key="item.id" v-model="item.checked"
					:name="item.id">{{ item.content }}</u-checkbox>
			</u-checkbox-group>
			</scroll-view>
		</view>
		<view class="main" v-else="modalType === 'label'">
			<scroll-view scroll-y class="scrollView">
				
			<u-checkbox-group :wrap="true" active-color="#F1598E">
				<u-checkbox v-for="(item, index) in labelList" class="checkbox " :key="item.id" v-model="item.checked"
					:name="item.id">{{ item.content }}</u-checkbox>
			</u-checkbox-group>
			</scroll-view>
		</view>
		<view class="footer flex-end">
			<text @click="isCancel">{{ $t('addStaff.cancelText') }}</text>
			<text class="isOk" @click="isConfirm">{{ $t('addStaff.confirmText') }}</text>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				figureId: undefined, //存储身材信息				
				selectServiceIdList: [], // 选中的服务类型ID
				selectLabelIdList: [], // 选中的标签ID	
				selectServiceTextList: [], // 选中的服务类型Text
				selectLabelTextList: [], // 选中的标签Text
			}
		},
		props: {
			modalType: {
				type: String
			},
			figureInfo: {
				type: Object
			},
			figureList: {
				type: Array,
				default () {
					return []
				}
			},
			serviceList: {
				type: Array,
				default () {
					return []
				}
			},
			labelList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		filters: {
			modalName(type) {
				if (type === "figure") {
					return "身材体型";
				} else if (type === "serviceType") {
					return "服务类型";
				} else if (type === "label") {
					return "标签"
				}
				return ''
			}
		},
		computed:{
			modalTitle() {
				return (type) => {
					if (type === "figure") {
						return this.$t('addStaff.bodyType')
					} else if (type === "serviceType") {
						return this.$t('addStaff.serviceType')
					} else if (type === "label") {
						return this.$t('addStaff.Tag')
					}
					return ''
				}
			}
		},
		created() {
			this.figureId = this.figureInfo.figureId;
			let checkedServices = this.serviceList.filter(t => t.checked);
			checkedServices.forEach(item => {
				this.selectServiceIdList.push(item.id);
				this.selectServiceTextList.push(item.content);
			})
			let checkedLabels = this.labelList.filter(t => t.checked);
			checkedLabels.forEach(item => {
				this.selectLabelIdList.push(item.id);
				this.selectLabelTextList.push(item.content);
			})
		},
		methods: {
			radioChange(e) {
				this.figureId = e;
			},
			isCancel() {
				this.beforeClosed(this.figureInfo.figureId, 1);
				this.$emit("popupCancel", {
					isCancel: true
				})
			},
			isConfirm() {
				this.beforeClosed(this.figureId, 0);
				this.$emit("popupConfirm", {
					isConfirm: true,
					selectServiceIdList: this.selectServiceIdList,
					selectServiceTextList: this.selectServiceTextList,
					selectLabelIdList: this.selectLabelIdList,
					selectLabelTextList: this.selectLabelTextList
				})
			},
			beforeClosed(figureId, optionType) {
				if (this.modalType === "figure") {
					this.setFigureInfo(figureId);
				} else if (this.modalType === "serviceType") {
					this.setServiceInfo(optionType);
				} else if (this.modalType === "label") {
					this.setLabelInfo(optionType);
				}
			},
			setFigureInfo(figureId) {
				if (figureId && this.figureList) {
					let figure = this.figureList.find(t => t.id === figureId);
					let figureTxt = '';
					if (figure) {
						figureTxt = figure.content;
					}
					this.$set(this.figureInfo, "figureId", figureId);
					this.$set(this.figureInfo, "figureTxt", figureTxt);
				}
			},
			setServiceInfo(type) {
				if (type === 0) { //Confirm
					let checkedService = this.serviceList.filter(t => t.checked);
					this.selectServiceIdList = [];
					this.selectServiceTextList = [];
					checkedService.forEach(t => {
						this.selectServiceIdList.push(t.id);
						this.selectServiceTextList.push(t.content);
					})
				} else if (type === 1) { //Cancel
					this.serviceList.forEach(t => {
						this.$set(t, 'checked', false);
					})
					if (this.selectServiceIdList) {
						let checkedService = this.serviceList.filter(t => this.selectServiceIdList.indexOf(t.id) > -1);
						this.selectServiceTextList = [];
						checkedService.forEach(t => {
							this.$set(t, 'checked', true);
							this.selectServiceTextList.push(t.content);
						})
					} else {
						this.selectServiceTextList = [];
					}
				}
			},
			setLabelInfo(type) {
				if (type === 0) { //Confirm
					let checkedLabel = this.labelList.filter(t => t.checked);
					this.selectLabelIdList = [];
					this.selectLabelTextList = [];
					checkedLabel.forEach(t => {
						this.selectLabelIdList.push(t.id);
						this.selectLabelTextList.push(t.content);
					})
				} else if (type === 1) { //Cancel
					this.labelList.forEach(t => {
						this.$set(t, 'checked', false);
					})
					if (this.selectLabelIdList) {
						let checkedLabel = this.labelList.filter(t => this.selectLabelIdList.indexOf(t.id) > -1);
						this.selectLabelTextList = [];
						checkedLabel.forEach(t => {
							this.$set(t, 'checked', true);
							this.selectLabelTextList.push(t.content);
						})
					} else {
						this.selectLabelTextList = [];
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.modalBox {
		// 弹框选择
		.titleName {
			border-bottom: 2rpx solid #eaeaea;
			padding: 20rpx 40rpx;
			font-size: 36rpx;
			// flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-family: 'PingFangSCBold';
		}

		.main {
			padding: 50rpx 40rpx;
			
			.scrollView{
				height: 600rpx;
				overflow: auto;
			}
			.radio {
				margin: 10rpx 0;

				/deep/.u-radio__label {
					margin-left: 20rpx;
				}
			}

			.checkbox {
				margin: 10rpx 0;

				/deep/.u-checkbox__label {
					margin-left: 20rpx;
				}
			}

			.bustLabel {
				color: $font-color-pink;
				font-size: 36rpx;
				font-family: 'PingFangSCBold';
				margin-bottom: 30rpx;
			}

			/deep/ .u-slider {
				margin: 40rpx 0;
			}

		}

		.footer {
			padding: 20rpx 40rpx;
			border-top: 2rpx solid #eaeaea;

			text {
				font-size: 28rpx;
				font-family: 'PingFangSCBold';

				&.isOk {
					color: $pink;
					margin-left: 80rpx;
				}
			}
		}
	}
</style>
