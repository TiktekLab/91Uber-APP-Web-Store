<template>
	<view class="bodyMain hideScroll">
		<u-navbar title="编辑员工" />
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
			<u-button hover-class="none" plain class="searchBtn pink m-btn" :loading="saveLoading" @click="saveStaff">保存并更新员工信息</u-button>
		</view>
	</view>
</template>

<script>
	let reg = /^(http|https):\/\/([\w.]+\/?)\S*/;
	import shmilyDragImage from "@/components/shmily-drag-image/shmily-drag-image.vue";
	import { uploadFile, uploadFiles } from "@/common/js/filerequest.js";
	export default {
		components: {
			shmilyDragImage
		},
		async onLoad(option) {
			this.staffInfo = uni.getStorageSync("staffDetails");
			this.picTureList = this.staffInfo.images;
			this.videoUrl = this.staffInfo.video;
			//console.log("员工详情：", this.staffInfo);
			const that = this;
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on("editStaffOne", data => {
				if (data) {
					that.addStaffData = Object.assign({}, data, that.addStaffData);
				} else {
					uni.navigateBack();
				}
			});
			await this.getData();
			this.initSelectData();
		},
		data() {
			return {
				addStaffData: {
					video: null, // 视频地址
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
				staffInfo: undefined, // 员工详情				
				saveLoading: false
			};
		},
		methods: {
			async getData() {
				await this.$http.get(this.$api.figuresList, this.pageInfo).then(res => {
					// 身材列表
					this.figuresList = res.list;
				});
				await this.$http.get(this.$api.labelList, this.pageInfo).then(res => {
					// 标签列表
					res.list.map(it => {
						this.$set(it, "active", false);
					});
					this.labelList = res.list;
				});
				await this.$http.get(this.$api.serviceTypeList, this.pageInfo).then(res => {
					// 服务列表
					res.list.map(it => {
						this.$set(it, "active", false);
					});
					this.serviceTypeList = res.list;
				});
			},
			initSelectData() {
				// 数据回填
				this.figuresList.map((it, i) => {
					if (it.id === this.staffInfo.figureId) {
						this.figuresIndex = i;
					}
				});
				this.labelList.map((item, index) => {
					this.staffInfo.labelIds.map((it, i) => {
						if (item.id === it) {
							item.active = true;
						}
					});
				});
				this.serviceTypeList.map((item, index) => {
					this.staffInfo.serveIds.map((it, i) => {
						if (item.id === it) {
							item.active = true;
						}
					});
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
					let uploadImgs = []; // 本地文件路径，需要执行上传
					let serverImgs = []; // 服务器图片路径，不需要执行上传
					that.picTureList.map((it, i) => {
						if (!reg.test(it)) {
							uploadImgs.push({
								name: "file" + i,
								uri: it
							});
						} else {
							serverImgs.push(it);
						}
					});
					//console.log("现在的图片列表：", that.picTureList);
					//console.log("图片列表：", uploadImgs);
					if (!uploadImgs.length) {
						that.addStaffData.images = [...serverImgs];
						resolve();
					} else {
						uploadFiles({
							url: that.$api.imgUploads,
							files: uploadImgs,
							formData: {
								folderPath: "danners"
							},
							loading: true
						}).then(res => {
							let images = [];
							console.log("照片列表上传：", res);
							res.list.map(item => {
								images.push("https://" + item);
							});
							that.addStaffData.images = [...images, ...serverImgs];
							resolve();
						}).catch(err => {
							uni.showToast({
								title: "照片上传失败",
								icon: "none",
								success() {
									that.addStaffData.images = [...serverImgs];
								}
							});
							resolve();
						});
					}
				});
			},
			async saveStaff() {
				// 保存员工
				if(!this.picTureList.length){
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
				//console.log("更新员工数据：", this.addStaffData);
				this.$http.put(this.$api.updateStaffInfo + this.staffInfo.id, this.addStaffData).then(res => {					
					this.saveLoading = false;
					uni.$emit('updateStaffList');
					uni.navigateBack({
						delta: 2
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
					if (reg.test(this.videoUrl)) return;
					this.UploadVideo();
				}
			}
		}
	};
</script>

<style lang="scss" scoped src="../css/addStaffTwo.scss"></style>
