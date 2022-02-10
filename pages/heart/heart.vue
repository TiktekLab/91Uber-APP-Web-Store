<template>
	<view class="bodyMain hideScroll bodyBG">
		<view class="stat"></view>
		<view class="welcome flex-space-between padding50" v-if="storeInfo">
			<view class="left flex-space-around">
				<text class="hello">Hello {{ storeInfo.name }}</text>
				<text>欢迎商家回来</text>
			</view>
			<u-image class="m-icon" id="avatar" style="flex: 0 0 130rpx"
				:src="storeInfo.avatar || avatarUrl(storeInfo.id)" width="130" height="130" shape="circle"
				mode="aspectFill" />
		</view>
		<text class="pageTitle flex-start padding50">员工列表</text>
		<!-- 员工列表 -->
		<view :class="['staffList padding50', { isAndroid: isAndroid }]">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="getStoreStaffList"
				:up="upOption">
				<view v-for="(item, index) in staffList" :key="index"
					:class="['staffItem',{Disable: item.blacklisted }]"
					@click="!item.blacklisted && navigateTo('./workList/workList', item.id)">
					<view class="staffInfo flex-space-between">
						<view class="left flex">
							<u-image class="avatar" id="avatar" :src="item.avatar" width="80" height="80"
								mode="aspectFill" />
							<text class="staffName flex">{{ item.username }}</text>
						</view>
						<!-- noWork：没有工作、Offline：已下线 -->
						<view class="right flex-center" @click.stop="onShowAction(item,index)">
							<text :class="['staffStatus Offline']" v-if="item.blacklisted || item.status === 0">下线</text>
							<text :class="['staffStatus ']" v-else-if="item.status === 1">有排班</text>
							<text :class="['staffStatus noWork']" v-else>没有排班</text>
							<text class="iconfont staffIcon">&#xe626;</text>
						</view>
					</view>
					<text class="flex-start nextTime" v-if="!item.blacklisted">下次预约时间：{{ item.nextWorkingTime }}</text>
					<!-- 员工在后台被禁用 -->
					<view class="blacklisted flex-center" v-if="item.blacklisted">
						<u-button hover-class="none" plain class="pink m-btn"
							@click="navigateTo('../user/contactUs/contactUs',false)">联系客服</u-button>
						<text class="disableInfo">该员工被多人投诉，已被后台禁用</text>
					</view>
				</view>
			</mescroll-body>
		</view>
		<!-- 新增员工 -->
		<view :class="['addStaffBox ']">
			<view class="addStaff flex-center" @click="navigateTo('./addStaffOne/addStaffOne', false)">
				<u-image :src="avatarUrl(50)" width="88" height="88" shape="circle" mode="aspectFill" />
				<view class="flex-center plus">
					<u-icon name="plus" color="#ff36a2" />
					<text class="text flex-center">添加新员工</text>
				</view>
			</view>
		</view>
		<u-action-sheet :list="actionList" border-radius="20" @click="onAction" safe-area-inset-bottom
			v-model="isShowAction" />
		<u-modal v-model="isShowModal" show-cancel-button @cancel="onShowModal" @confirm="delStaff" title="确认删除？"
			content="员工删除后不可恢复,如果有预约的客户也将同时被取消，请谨慎操作" />
		<!-- 自定义tabBar -->
		<tabBar :active="0" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import tabBar from "@/component/tabBar/tabBar.vue";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			tabBar
		},
		data() {
			return {
				isShowAction: false, // 是否显示action
				isShowModal: false, // 是否显示modal
				staffList: [],
				staffChecked: undefined,
				staffIndex: undefined,
				actionList: [{
						text: "上线"
					},
					{
						text: "下线"
					},
					{
						text: "删除"
					}
				],
				upOption: {
					page:{
						num : 0 ,
						size : 200 ,
						time : null
					},
					textNoMore: "-- 没有更多数据 --",
					noMoreSize: 0,
					toTop: {
						bottom: 200
					}
				}
			};
		},
		onLoad() {
			uni.hideTabBar();
		},
		onReady() {			
			uni.$on("updateStaffList", () => {
				this.downCallback();
			});
		},
		onUnload() {
			uni.$off('updateStaffList')
		},
		methods: {
			...mapMutations(['setStaffCount']),
			downCallback() {
				// 下拉加载刷新上拉加载
				this.mescroll.resetUpScroll();
			},
			navigateTo(url, data) {
				// 跳转
				if (!data) {
					uni.navigateTo({
						url: url
					});
				} else {
					uni.navigateTo({
						url: `${url}?data=${encodeURIComponent(data)}`
					});
				}
			},
			getStoreStaffList(page) {
				let param = {
					pageNum: page.num,
					pageSize: page.size
				};
				this.$http.get(this.$api.storeStaffList, param).then(res => {
						if (page.num == 1) this.staffList = [];
						this.staffList = this.staffList.concat(res.list);
						//console.log('员工列表：', this.staffList);
						this.mescroll.endBySize(res.list.length, res.count);
						this.setStaffCount(res.count);
					}).catch(err => {
						this.mescroll.endErr();
					});
			},
			onShowAction(item, index) {
				this.staffChecked = item;
				this.staffIndex = index;
				this.isShowAction = !this.isShowAction;
			},
			onShowModal() {
				this.isShowModal = !this.isShowModal;
			},
			onAction(e) {
				if (e === 2) {  // 删除
					return this.onShowModal();
				} else if (e === 1) {  // 下线
					if (this.staffChecked.status !== 0) {
						this.$http.put(this.$api.staffDown(this.staffChecked.id)).then(res => {
							this.staffList[this.staffIndex].status = 0;
							this.downCallback();
						});
					}
				} else {  // 上线
					if (this.staffChecked.blacklisted) {
						return this.$u.toast('被管理员禁用，无法上线，请联系客服');
					}
					// uni.navigateTo({
					// 	url: `./workList/workList?data=${encodeURIComponent(this.staffChecked.id)}`
					// });					
					if (this.staffChecked.status === 0) {
						this.$http.get(this.$api.staffWorkHours, { employeeId: this.staffChecked.id }).then(res => {
								const allTimeList = res.list;
								if (allTimeList.length > 0) {
									//有排班，上线
									this.$http.put(this.$api.staffUp(this.staffChecked.id)).then(res => {
										this.downCallback();													
									});
								} else {
									//未排班
									uni.navigateTo({
										url: `./workList/workList?data=${encodeURIComponent(this.staffChecked.id)}`
									});
								}
						})		
					} else {
						this.$u.toast('已是上线状态');						
					}
				}
			},
			//排序员工
			sortStaff(){	
				//上线排前面，下线排后面
				this.staffList.sort(function(pre, next) {
					if (next.status < pre.status) {
						return -1;
					} else {
						return 1;
					}
				})
			},
			delStaff() {
				// 删除员工
				this.$http.delete(this.$api.deleteStaff + this.staffChecked.id).then(res => {
					this.getStoreStaffList({
						num: 1,
						size: 200
					});
				});
			}
		},
		computed: {
			...mapState({
				storeInfo: state => state.storeInfo,
			})
		},
	};
</script>

<style lang="scss" scoped src="./css/heart.scss"></style>
