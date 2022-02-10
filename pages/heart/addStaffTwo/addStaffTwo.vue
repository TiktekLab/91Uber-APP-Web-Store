<template>
	<view class="bodyMain hideScroll">
		<u-navbar title="添加新员工" />
		<view class="formItem ">
			<view class="inputLable flex-start">
				<text class="lable flex">添加照片*</text>
				<text class="lable flex tips">(至少添加一张)</text>
			</view>
			<view class="pictureBox">
				<shmily-drag-image :list.sync="picTureList" :imageWidth="172" />
				<text class="dragInfo">长按图片可拖动调整顺序</text>
			</view>
		</view>
		<viwe class="border flex-center"></viwe>
		<view class="formItem ">
			<view class="inputLable flex-start"><text class="lable flex">添加视频</text></view>
			<view class="videoBox">
				<view :class="['videoItem  flex-center', { videoPlay: videoUrl }]" @click="selectVideo">
					<text class="iconfont videoIcon">{{ videoUrl ? "&#xe664;" : "&#xe627;" }}</text>
					<text class="iconfont del" @click.stop="delVideo" v-if="videoUrl">&#xe605;</text>
				</view>
			</view>
		</view>
		<viwe class="border flex-center"></viwe>
		<view class="formItem ">
			<view class="inputLable flex-start"><text class="lable flex">身材类型*</text></view>
			<view class="lableBox flex">
				<view :class="['lableItem m-radius flex-center', { active: figuresIndex === index }]"
					@click="selectItem(index)" v-for="(item, index) in figuresList" :key="index">
					<text>{{ item.content }}</text>
				</view>
			</view>
		</view>
		<viwe class="border flex-center"></viwe>
		<view class="formItem ">
			<view class="inputLable flex-start">
				<text class="lable flex">兴趣爱好</text>
				<text class="lable flex tips">(可多选)</text>
			</view>
			<view class="lableBox flex">
				<view :class="['lableItem m-radius flex-center', { active: item.active }]"
					@click="activeItem(item, 'checkbox')" v-for="(item, index) in serviceTypeList" :key="index">
					<text>{{ item.content }}</text>
				</view>
			</view>
		</view>
		<viwe class="border flex-center"></viwe>
		<view class="formItem ">
			<view class="inputLable flex-start">
				<text class="lable flex">标签</text>
				<text class="lable flex tips">(可多选)</text>
			</view>
			<view class="lableBox flex">
				<view :class="['lableItem m-radius flex-center', { active: item.active }]"
					@click="activeItem(item, 'checkbox')" v-for="(item, index) in labelList" :key="index">
					<text>{{ item.content }}</text>
				</view>
			</view>
		</view>
		<view :class="['PreciseSearch padding ', { isAndroid: isAndroid }]">
			<u-button hover-class="none" plain class="searchBtn pink m-btn" :loading="saveLoading" @click="saveStaff">保存，且开始排班</u-button>
		</view>
	</view>
</template>

<script>
	import shmilyDragImage from "@/components/shmily-drag-image/shmily-drag-image.vue";
	import { uploadFile, uploadFiles } from "@/common/js/filerequest.js";
	import { mapState, mapMutations } from "vuex";
	export default {
		components: {
			shmilyDragImage
		},
		onLoad() {
			const that = this;
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on("addStaffOne", data => {
				if (data) {
					that.addStaffData = Object.assign({}, data, that.addStaffData);
				} else {
					uni.navigateBack();
				}
			});
			this.getData();
		},
		data() {
			return {
				addStaffData: {
					video: undefined, // 视频地址
					serveIds: [],
					labelIds: [],
					images: [] // 图片列表
				},
				pageInfo: {
					pageNum: 1,
					pageSize: 100
				},
				picTureList: [], // 图片列表
				figuresList: [], // 身材类型
				labelList: [], // 标签
				figuresIndex: null, // 当前选中的标签
				serviceTypeList: [], // 兴趣爱好
				videoUrl: undefined, // 视频地址
				saveLoading: false
			};
		},
		methods: {
			getData() {
				this.$http.get(this.$api.figuresList, this.pageInfo).then(res => {
					// 身材列表
					this.figuresList = res.list;
				});
				this.$http.get(this.$api.labelList, this.pageInfo).then(res => {
					// 标签列表
					res.list.map(it => {
						this.$set(it, "active", false);
					});
					this.labelList = res.list;
				});
				this.$http.get(this.$api.serviceTypeList, this.pageInfo).then(res => {
					// 服务列表
					res.list.map(it => {
						this.$set(it, "active", false);
					});
					this.serviceTypeList = res.list;
				});
			},
			activeItem(e) {
				e.active = !e.active;
			},
			selectItem(i) {
				this.figuresIndex = i;
			},
			selectVideo() {
				// 选择视频
				const that = this;
				if (this.videoUrl) {
					uni.navigateTo({
						url: "../../user/videoPlay/videoPlay?data=" + encodeURIComponent(JSON.stringify(this
							.videoUrl))
					});
				} else {
					uni.chooseVideo({
						success(e) {
							that.videoUrl = e.tempFilePath;
						}
					});
				}
			},
			delVideo() {
				// 删除视频
				this.videoUrl = undefined;
			},
			UploadVideo() {
				// 上传视频
				const that = this;
				uploadFile({
					url: this.$api.videoUpload,
					filePath: this.videoUrl,
					name: "file",
					formData: {
						folderPath: "danners"
					},
					loading: true,
					success: res => {
						console.log("视频上传地址：", res);
						that.addStaffData.video = "https://" + res.result;
					},
					fail: err => {
						uni.showToast({
							title: "视频上传失败",
							icon: "none",
							success() {
								that.addStaffData.video = null;
							}
						});
					}
				});
			},
			UploadPicTrue() {
				// 上传图片
				return new Promise(resolve => {
					const that = this;
					let imgs = [];
					that.picTureList.map((value, index) => {
						imgs.push({
							name: "file" + index,
							uri: value
						});
					});
					uploadFiles({
						url: that.$api.imgUploads,
						files: imgs,
						formData: {
							folderPath: "danners"
						},
						loading: true
					}).then(res => {
						let images = [];
						console.log("图片列表上传：", res);
						res.list.map(item => {
							images.push("https://" + item);
						});
						that.addStaffData.images = images;
						resolve();
					}).catch(err => {
						uni.showToast({
							title: "照片上传失败",
							icon: "none",
							success() {
								that.addStaffData.images = [];
							}
						});
						resolve();
					});
				});
			},
			async saveStaff() {
				// 保存员工
				if (!this.picTureList.length) {
					return this.$u.toast("至少添加一张照片");
				}
				if (!this.figuresIndex && this.figuresIndex !== 0) return this.$u.toast("请选择身材类型");
				this.addStaffData.figureId = Number(this.figuresList[this.figuresIndex].id);
				const serviceActive = this.serviceTypeList.filter(t => t.active);
				if (!serviceActive.length) return this.$u.toast("请选择感兴趣的服务");
				this.addStaffData.serveIds = [];
				serviceActive.map(it => {
					this.addStaffData.serveIds.push(it.id);
				});
				const labelActive = this.labelList.filter(t => t.active);
				if (!labelActive.length) return this.$u.toast("请选择标签");				
				await this.UploadPicTrue();
				if (!this.addStaffData.images.length) {
					return this.$u.toast("至少添加一张照片");
				}
				this.saveLoading = true;
				this.addStaffData.labelIds = [];
				labelActive.map(it => {
					this.addStaffData.labelIds.push(it.id);
				});
				console.log("提交数据：", this.addStaffData);
				this.$http.post(this.$api.createStaff, this.addStaffData).then(res => {
					this.saveLoading = false;
					uni.$emit('updateStaffList');
					uni.navigateTo({
						url: `../workList/workList?data=${encodeURIComponent(res.id)}`
					});
				}).catch(err => {
					this.saveLoading = false;
				});
			}
		},
		watch: {
			videoUrl() {
				this.addStaffData.video = null;
				if (this.videoUrl) {
					this.UploadVideo();
				}
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.userInfo
			})
		}
	};
</script>

<style lang="scss" scoped src="../css/addStaffTwo.scss"></style>
