<template>
	<view class="bodyMain ">
		<u-navbar :is-back="false" title="消息" :border-bottom="false" />
		<!-- 顶部的导航 -->
		<u-tabs :list="tabList" height="100" class="tabs" :is-scroll="false" :current="currenTab" bar-width="100"
			active-color="#000000" @change="changeTab" />
		<view :class="['listBox',{isAndroid: isAndroid}]">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="getData" :up="upOption">
				<uni-swipe-action>
					<uni-swipe-action-item v-if="currenTab === 0" :right-options="swipeAction"
						@click="deleteFunc($event, index)" v-for="(item, index) in messageList" :key="'order' + index">
						<newItem :showType="currenTab" :ItemEvent="ItemEvent" :ItemDetails="item" :itemIndex="index" />
					</uni-swipe-action-item>
					<uni-swipe-action-item v-if="currenTab === 1" :right-options="swipeAction"
						@click="deleteFunc($event, index)" v-for="(item, index) in messageList" :key="'Notice' + index">
						<SystemItem :ItemEvent="noticeInfo" :ItemDetails="item" :itemIndex="index" />
					</uni-swipe-action-item>
				</uni-swipe-action>
			</mescroll-body>
		</view>
		<!-- 弹窗信息 -->
		<u-modal v-model="isShowModal" :content="modalOptions.content" :title="modalOptions.title"
			:confirm-text="modalOptions.confirmText" show-cancel-button :cancel-text="modalOptions.cancelText"
			@confirm="confirmFunc" @cancel="cancelFunc"></u-modal>
		<!-- 自定义tabBar -->
		<tabBar :active="1" />
	</view>
</template>

<script>
	import { mapState } from "vuex";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import tabBar from "@/component/tabBar/tabBar.vue";
	import newItem from "@/component/newItem/newItem.vue";
	import SystemItem from "@/component/SystemItem/SystemItem.vue";
	import { getLocalNoticeList, readLocalNotice, deleteLocalNotice } from "@/common/js/localDatabse.js";
	import { updateNotificationUnreadCount, updateRemindUnreadCount, updateNoticeUnreadCount } from "@/common/js/storeCommon.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			tabBar,
			newItem,
			SystemItem
		},
		data() {
			return {
				currenTab: 0,
				tabList: [{
						name: "订单请求",
						count: "0"
					},
					{
						name: "系统公告",
						count: "0"
					}
				],
				isShowModal: false, // 是否显示提醒弹框
				modalOptions: { //弹框
					title: '',
					content: '',
					confirmText: '',
					cancelText: '',
				},
				callOptions: { //操作类型
					optionType: undefined,
					itemIndex: undefined,
				},
				swipeAction: [{
					text: "删除",
					style: {
						backgroundColor: "#FC4850"
					}
				}],
				upOption: {
					textNoMore: "-- 没有更多数据 --",
					noMoreSize: 0,
					toTop: {
						bottom: 200
					}
				},
				messageList: [], //消息列表数据
				freshUnReadCount: false, //是否更新未读消息数量
			};
		},
		onLoad() {
			uni.hideTabBar();
			if (this.notificationUnreadCount > 0) {
				this.currenTab = 0;
			} else if (this.noticeUnreadCount > 0) {
				this.currenTab = 1;
			}
			this.updateUnReadBadge();
		},
		onReady() {
			uni.$on("updateMessage", data => {
				this.onUpdateMessage(data);
			});			
		},
		computed: {
			...mapState({
				notificationUnreadCount: state => state.notificationUnreadCount,
				remindUnreadCount: state => state.remindUnreadCount,
				noticeUnreadCount: state => state.noticeUnreadCount,
			})
		},
		watch: {
			notificationUnreadCount() {
				this.tabList[0].count = this.notificationUnreadCount;
			},
			noticeUnreadCount() {
				this.tabList[1].count = this.noticeUnreadCount;
			}
		},
		methods: {
			//监听页面更新
			onUpdateMessage(data) {
				switch (data.noticeType) {
					case 2:
						this.currenTab = 0;
						break;
					case 4:
						this.currenTab = 1;
						break;
				}
				this.messageList = [];
				this.freshUnReadCount = data.reset;
				this.mescroll.resetUpScroll();
			},
			downCallback() {
				// 下拉加载刷新上拉加载
				this.freshUnReadCount = true;
				this.mescroll.resetUpScroll();
			},
			getData(page) {
				if (this.currenTab === 0) {
					//0:查询订单请求
					this.$http.get(this.$api.notificationList, {
						pageNum: page.num,
						pageSize: page.size
					}).then(res => {
						if (page.num == 1) {
							this.messageList.splice(0, this.messageList.length, ...res.list);
						} else {
							this.messageList.push(...res.list);
						}
						//console.log('消息列表：',this.messageList,this.messageList.length);
						this.mescroll.endBySize(res.list.length, res.count);
						if (this.freshUnReadCount) updateNotificationUnreadCount();
					}).catch(err => {
						this.mescroll.endErr();
					})
				} else {
					//查询公告
					getLocalNoticeList(page.num, page.size).then(res => {
						if (page.num == 1) {
							this.messageList.splice(0, this.messageList.length, ...res.list);
						} else {
							this.messageList.push(...res.list);
						}
						this.mescroll.endBySize(res.list.length, res.count);
						if (this.freshUnReadCount) updateNoticeUnreadCount();
					}).catch(err => {
						this.mescroll.endErr();
					})
				}
			},
			changeTab(e) {
				// 切换tabs
				this.currenTab = e;
				this.messageList = [];
				this.freshUnReadCount = true;
				this.mescroll.resetUpScroll();
			},
			ItemEvent(e, index, associateId) {
				this.callOptions.optionType = e;
				this.callOptions.itemIndex = index;
				//console.log('接受订单请求：',e);
				//0.拒绝订单请求，1.接受订单请求，2.发送地址，3.灰色的开始服务，4.激活的开始服务，
				//5.confirm:结束服务，cancel:下线员工，6:拒绝推迟订单请求，7:接受推迟订单请求，8:已完成的订单前往评价
				//100:查看订单详情
				if ([0, 1, 2, 3, 5, 6,7].includes(e)) {
					this.modalOptions.confirmText = "确认";
					this.modalOptions.cancelText = "取消";
					switch (e) {
						case 0:
						case 6:
							this.modalOptions.title = "拒绝请求";
							this.modalOptions.content = "您确认要拒绝这个请求吗？";
							break;
						case 1:
						case 7:
							this.modalOptions.title = "接受请求";
							this.modalOptions.content = "您确认要接受这个请求吗？";
							break;
						case 2:
							this.modalOptions.title = "发送房号";
							this.modalOptions.content = "点击确认发送房号后，客户会立刻上门，请再次确认是否准备完毕。";
							this.modalOptions.confirmText = "确认发送";
							break;
						case 3:
							this.modalOptions.title = "不能开始服务";
							this.modalOptions.content = `请商家联系客人，并提醒客人点击"我已到达"，发送精确地址后可开始服务。`;
							break;
						case 5:
							this.modalOptions.title = "结束服务";
							this.modalOptions.content = "如果客户需要延长服务时间，请自商家进入工作列表自行添加个人时间段。";
							this.modalOptions.confirmText = "结束服务";
							this.modalOptions.cancelText = "添加时间";
							break;
					}
					this.isShowModal = true;
				}
				//  else if (e === 2) {
				// 	this.sendFullAddress();
				// } 
				else if (e === 4) {
					this.orderBegin();
				} else if (e === 8) {
					const msg = this.messageList[index];
					this.isReadMessage(msg);
					uni.navigateTo({
						url:`../user/evaluate/evaluate?orderId=${associateId}`
					})
				} else if (e === 100) {
					const msg = this.messageList[index];
					this.isReadMessage(msg);
					uni.navigateTo({
						url: `../user/orderDetails/orderDetails?orderId=${associateId}`
					})
				}
			},
			deleteFunc(e, index) { // 删除
				this.callOptions.itemIndex = index;
				if (this.currenTab === 0) {
					this.deleteMessage();
				} else {
					deleteLocalNotice(this.messageList[index].uId).then(res => {
						this.messageList.splice(index, 1);
						updateNoticeUnreadCount();
					})
				}
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			confirmFunc() {
				switch (this.callOptions.optionType) {
					case 0:
						this.disagreeOrder();
						break;
					case 1:
						this.agreeOrder();
						break;
					case 2:
						this.sendFullAddress();
						break;
					case 5:
						this.orderComplete();
						break;
					case 6:
						this.adjustPutOff(0);
						break;
					case 7:
						this.adjustPutOff(1);
						break;
				}
			},
			cancelFunc() {
				if (this.callOptions.optionType === 5) { //下线员工
					this.staffOffLine();
				}
			},
			noticeInfo(data, index) {
				this.callOptions.itemIndex = index;
				if (data.isRead === 0) {
					readLocalNotice(data.uId).then(res => {
						this.messageList[index].isRead = 1;
						updateNoticeUnreadCount();
					})
				}
				uni.navigateTo({
					url: "./noticeInfo/noticeInfo",
					success(res) {
						res.eventChannel.emit("acceptDataFromOpenerPage", data);
					}
				});
			},
			//店铺拒绝接单
			disagreeOrder() {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.post(this.$api.disagreeOrder(msg.associateId)).then(res => {
						msg.status = 6;
						msg.cancelReason = 0;
						this.isReadMessage(msg);
						uni.showToast({
							// title: this.$t('news.OrderRejected'),已拒绝接单
							title: '已拒绝接单',
							icon: 'none'
						});
					});
			},
			//店铺接单
			agreeOrder() {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.post(this.$api.agreeOrder(msg.associateId)).then(res => {
						msg.status = 1;
						this.isReadMessage(msg);
						uni.showToast({
							title: this.$t('news.OrderReceived'),
							icon: 'none'
						});
					});
			},
			//发送完整地址
			sendFullAddress() {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.post(this.$api.sendFullAddress(msg.associateId)).then(res => {
						msg.status = 3;
						this.isReadMessage(msg);
					})
			},
			//开始服务
			orderBegin() {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.put(this.$api.orderStart(msg.associateId)).then(res => {
						msg.status = 4;
						this.isReadMessage(msg);
					})
			},
			//结束服务
			orderComplete() {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.post(this.$api.orderComplete(msg.associateId)).then(res => {
						msg.status = 5;
						this.isReadMessage(msg);
					})
			},
			//拒绝或者接受推迟订单请求，0: 拒绝  1: 同意
			adjustPutOff(isAgree) {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.post(this.$api.adjustOrderPutOff(msg.associateId, isAgree)).then(res => {
						msg.putOffStatus = isAgree;
						this.isReadMessage(msg);
					})
			},
			//员工下线
			staffOffLine() {
				const msg = this.messageList[this.callOptions.itemIndex];
				this.$http.put(this.$api.staffDown(msg.employeeId)).then(res => {
					this.isReadMessage(msg);
				});
			},
			//消息是否已读
			isReadMessage(obj) {
				if (!obj.isRead) {
					this.readMessage(this.callOptions.itemIndex)
				}
			},
			//消息标记为已读
			readMessage(index) {
				const message = this.messageList[index];
				this.$http.post(this.$api.notificationRead(message.id)).then(res => {
					updateNotificationUnreadCount();
					message.isRead = true;
				})
			},
			//删除
			deleteMessage() {
				const message = this.messageList[this.callOptions.itemIndex];
				this.$http.delete(this.$api.deleteNotification(message.id)).then(res => {
					updateNotificationUnreadCount();
					this.messageList.splice(this.callOptions.itemIndex, 1);
				})
			},
			//更新tabs badge数量
			updateUnReadBadge() {
				this.tabList[0].count = this.notificationUnreadCount;
				this.tabList[1].count = this.noticeUnreadCount;
			},
			batchReadMessage() {
				const unReadList = this.messageList.filter(item => !item.isRead);
				if (unReadList.length > 0) {
					const ids = unReadList.map(item => {
						return item.id
					})
					this.$http.post(this.$api.batchNotificationRead, {
						ids
					}).then(res => {
						updateNotificationUnreadCount();
						unReadList.map(item => {
							item.isRead = true;
						})
					})
				}
			},
		},
		onUnload() {
			uni.$off("updateMessage");
		}
	};
</script>

<style lang="scss" scoped src="./css/news.scss"></style>
