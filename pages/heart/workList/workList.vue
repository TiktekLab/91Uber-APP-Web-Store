<template>
	<view class="bodyMain">
		<u-navbar title="员工日程表" :border-bottom="true" />
		<!-- 中途休息信息和tabs -->
		<view class="fixedTop">
			<view v-if="staffInfo" class="userInfo  flex-start" @click="navigateTo(`../editStaffOne/editStaffOne?id=${staffId}`)">
				<u-image class="m-icon" id="avatar" :src="staffInfo.avatar" width="100" height="100" shape="circle" mode="aspectFill" />
				<view class="flex-space-between info">
					<view class="left flex">
						<view class="flex-start">
							<text class="name">{{staffInfo.username}}</text>
							<view class="rate flex-start">
								<text class="iconfont icon">&#xe642;</text>
								<text class="count">{{staffInfo.score | scoreFormat()}}</text>
							</view>
						</view>
						<text v-if="staffInfo.blacklisted || staffInfo.status === 0" :class="['staffStatus Offline']">工作状态：下线</text>
						<text v-else-if="staffInfo.status === 1" :class="['staffStatus ']">工作状态：有排班</text>
						<text v-else :class="['staffStatus noWork']">工作状态：没有排班</text>
					</view>
					<u-icon name="arrow-right" color="#C7C7CC" />
				</view>
			</view>
			<u-tabs :list="indexList" name="key" active-color="#000" bar-width="60" :current="currenTabs" @change="chagneTabs" class="tabs" />
		</view>
		<!-- 排班列表 -->
		<view class="timeList">
			<view class="timeItem" v-for="(item, index) in timeList" :key="index">
				<view class="item title  flex-start" :id="item.title">
					<text>{{ item.key }}</text>
				</view>
				<!-- 	active：有预约的状态
				startTime：开始时间
				endTime：结束时间
				disable：中途休息时间 -->
				<view :class="['item padding30 flex-start ', { active: it.checked }, { disable: it.disable }, { startTime: it.startTime }, { endTime: it.endTime }]"
					 v-for="(it, i) in item.children" @click="timeSoltClick(it)" :key="i">
					<text>{{ it.time }}</text>
				</view>
			</view>
		</view>
		<!-- 添加排班按钮 -->
		<view class="plusBtn flex-center" @click="onShowPopup">
			<u-icon name="plus" color="#fff" size="50" />
		</view>
		<u-popup v-model="isShowPopup" :mask-close-able="false" mode="center" border-radius="20">
			<view class="popupBox">
				<view class="popupTitle flex-center">
					<text class="strong ">编辑时间安排</text>
					<text>请问要编辑排班还是员工中途休息时间</text>
				</view>
				<view class="listItem flex-center" @click="onShowAddTime(0)"><text>排班</text></view>
				<view class="listItem flex-center" @click="onShowAddTime(1)"><text>中途休息时间</text></view>
				<view class="listItem flex-center" @click="onShowPopup"><text>取消</text></view>
			</view>
		</u-popup>
		<!-- 添加时间面板 -->
		<u-popup v-model="isShowAddTime" mode="bottom" border-radius="20">
			<view class="addTimePopup">
				<view class="popupTitle flex-space-between ">
					<text class="cancel" @click="onHideAddTime">取消</text>
					<text>{{ workType === 1 ? '添加中途休息' : '添加排班' }}时间</text>
					<u-button class="m-btn save " hover-class="none" @click="onShowModal">保存</u-button>
				</view>
				<scroll-view class="popupBody " scroll-y>
					<view class="timeSlot padding" v-for="(item, index) in addTimeList" :key="index" @click="editTime(index)">
						<view class="timeItem flex-space-between">
							<text>开始时间</text>
							<text>{{ item.startTime }}</text>
						</view>
						<view class="timeItem flex-space-between">
							<text>结束时间</text>
							<text>{{ item.endTime }}</text>
						</view>
					</view>
					<view class="footerBtn flex-end">
						<u-button class="m-btn addTimeBtn " hover-class="none" @click="onSelectTime('start')">
							<u-icon name="plus" color="#ff36a2" size="30" />
							<text style="marginLeft: 10rpx">添加时间段</text>
						</u-button>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-modal v-model="showDeleteModal" content="确认取消该中途休息时间吗？" title="取消中途休息时间" :show-cancel-button="true" @confirm="deleteTime"/>
		<u-modal v-model="isShowModal" :content="modalContent" :title="modalTitle" @confirm="saveTime" />
		<u-modal v-model="showErrorModal" :content="errorObj.content" :title="errorObj.title" :show-cancel-button="errorObj.showCancel" :confirm-text="errorObj.confirmText" @confirm="errorObj.confirmFunc"/>
		<TimeSelection v-model="isSelectStartTime" :defaultTime="defaultStartTime" safe-area-inset-bottom title="开始时间" @confirm="confirmTime($event, 'start')" />
		<TimeSelection v-model="isSelectEndTime" :defaultTime="defaultEndTime" safe-area-inset-bottom title="结束时间" @confirm="confirmTime($event, 'end')" />
	</view>
</template>

<script>
	import TimeSelection from "../component/TimeSelection/TimeSelection.vue";
	import moment from "moment";
	export default {
		components: {
			TimeSelection
		},
		onBackPress(options) {
			if(this.preRouterInfo.route === "pages/heart/addStaffTwo/addStaffTwo") {
				uni.switchTab({
					url: '../heart'
				});
				return true;				
			}
			return false;
		},
		onLoad(option) {
			const data = decodeURIComponent(option.data);
			this.staffId = data;
			this.getStaffInfo();
			this.getIndexList();
			this.getWorkHourList();
			const routes = getCurrentPages();
			this.preRouterInfo = routes[routes.length - 2]; // 上个页面
		},
		onPageScroll(e) {
			this.nodeInfo.map((item, index) => {
				if (e.scrollTop >= item.top - 210) {
					this.currenTabs = index;
				}
			});
		},
		onReady() {	
			uni.$on("autoUpdateByPushMsg", () => {
				this.getWorkHourList();
			});
		},
		data() {
			return {				
				preRouterInfo: undefined, //上个页面
				isShowModal: false, // 是否显示保存排班弹框
				modalTitle: '', // 弹框标题
				modalContent: '', // 弹框内容
				showErrorModal: false,
				errorObj: {
					title: undefined,
					content: undefined,
					showCancel: false,
					confirmText: "确认",
					confirmFunc: ()=>{}
				},
				isScroll: false,
				staffId: undefined,
				staffInfo: undefined,
				isShowPopup: false, // 是否显示popup弹框
				isShowAddTime: false, // 是否显示添加时间popup弹框
				isSelectStartTime: false, // 开始时间
				defaultStartTime: undefined,
				defaultEndTime: undefined,
				isEditTime: false,
				editIndex: null,
				isSelectEndTime: false, // 结束时间
				startTime: undefined,
				endTime: undefined,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				nodeInfo: [], // 节点信息
				workType: undefined, // 排版类型
				currenTabs: 0, // 当前选中的tabs
				indexList: [],
				timeList: [],
				addTimeList: [], // 添加排班列表
				deleteWorkTimeId: null, //删除时间ID
				showDeleteModal: false, //是否显示删除时间表弹框
			};
		},
		methods: {	
			onShowModal() {
				if (!this.addTimeList.length) return this.$u.toast("请添加时间段");
				this.isShowModal = !this.isShowModal;
				if (this.workType) {
					this.modalContent = '确认保存中途休息时间吗？'
					this.modalTitle = '保存中途休息时间'
				} else {
					this.modalContent = '确认保存排班时间吗？'
					this.modalTitle = '保存排班时间'
				}
			},
			chagneTabs(e) {
				this.currenTabs = e;				
				let curNode = this.nodeInfo.find(item => item.id === this.indexList[e].name);
				if(curNode) {
					uni.pageScrollTo({
						scrollTop: curNode.top - 209,
						duration: 100
					});					
				}	
			},
			//时间点击
			timeSoltClick(item) {
				if(item.checked) {
					this.navigateTo(`../../user/orderDetails/orderDetails?workTimeId=${item.workTimeId}`);
				} else if(item.disable) {
					this.deleteWorkTimeId = item.id;
					this.showDeleteModal = true;
				}
			},
			getStaffInfo() { //查询员工信息
				this.$http.get(this.$api.staffDetails + this.staffId).then(res => {
					this.staffInfo = res.employee;
				})
			},
			getIndexList() {
				this.indexList = [];
				this.timeList = [];
				for (var i = 0; i < 7; i++) {
					const getDate = moment().add(i, 'd');
					const key = moment().locale('zh-cn').add(i, "d").format("ddd D号");
					const title = moment().add(i, "d").format("dddD");
					this.indexList.push({
						name: title,
						key: key
					})
					this.timeList.push({
						day: getDate.format("YYYY-MM-DD"),
						key: key,
						title: title,
						children: []
					})
				}
			},
			getWorkHourList() {
				this.$http.get(this.$api.staffWorkHours, {
						employeeId: this.staffId
					}).then(res => {
						const allTimeList = res.list;
						if (allTimeList.length > 0) {
							this.timeList.map(item => {
								const queryTimeList = allTimeList.filter(q => q.startTime.includes(item.day));
								if (queryTimeList.length > 0) {
									const timeSlotsAll = this.getTimeSlotList(queryTimeList);
									const timeSlotsBooked = this.getActiveSlots(timeSlotsAll, queryTimeList);
									const timeSlotsDisabled = this.getDisableSlots(timeSlotsBooked,	queryTimeList);
									item.children.splice(0, item.children.length, ...timeSlotsDisabled);
								} else {
									item.children.splice(0, item.children.length);
								}
							})
							setTimeout(() => {
								this.getNodeInfo();
							}, 1500);
						}
					})
			},
			//拆分时间段
			getTimeSlotList(timeList) {
				const timeSlotList = [];
				timeList.map(time => {
					let startTime = moment(time.startTime);
					let endTime = moment(time.endTime);
					//时间段列表
					while (moment(startTime).isBefore(moment(endTime))) {
						const middleTime = moment(startTime).add(30, 'm').format();
						const item = {
							id: time.id,
							time: moment(startTime).format('HH:mm') + '-' + moment(middleTime).format('HH:mm'),
							startLabel: moment(startTime).format('HH:mm'),
							endLabel: moment(middleTime).format('HH:mm'),
							checked: false,
							disable: false,
							startTime: false,
							endTime: false,
							workTimeId: null,
							sortTime: moment(startTime).format()
						}
						timeSlotList.push(item);
						startTime = middleTime;
					}
				})
				//升序排序
				timeSlotList.sort(function(pre, next) {
					if (moment(pre.sortTime).isBefore(moment(next.sortTime))) {
						return -1;
					} else {
						return 1;
					}
				})
				return timeSlotList;
			},
			//已预约时间段
			getActiveSlots(timeSlots, timeList) {
				timeList.filter(item => item.type === 1).map(item => {
					const start = moment(item.startTime).format('HH:mm');
					const end = moment(item.endTime).format('HH:mm');
					const startIndex = timeSlots.findIndex(t => t.startLabel === start);
					const endIndex = timeSlots.findIndex(t => t.endLabel === end);
					for (let i = startIndex; i <= endIndex; i++) {
						timeSlots[i].checked = true;
						timeSlots[i].workTimeId = item.id;
					}
					timeSlots[startIndex].startTime = true;
					timeSlots[endIndex].endTime = true;
				})
				return timeSlots;
			},
			//已禁用时间段
			getDisableSlots(timeSlots, timeList) {
				timeList.filter(item => item.type === 2).map(item => {
					const start = moment(item.startTime).format('HH:mm');
					const end = moment(item.endTime).format('HH:mm');
					const startIndex = timeSlots.findIndex(t => t.startLabel === start);
					const endIndex = timeSlots.findIndex(t => t.endLabel === end);
					for (let i = startIndex; i <= endIndex; i++) {
						timeSlots[i].disable = true;
					}
				})
				return timeSlots;
			},
			getNodeInfo() {
				this.nodeInfo.splice(0, this.nodeInfo.length);
				for (let i = 0; i < this.timeList.length; i++) {
					uni.createSelectorQuery().select("#" + this.timeList[i].title).boundingClientRect().exec(ret => {
							const rect = ret[0];
							if (rect) {
								this.nodeInfo.push({
									top: rect["top"],
									id: rect["id"]
								});
							}
						});
				}
			},
			navigateTo(e) {
				// 跳转到订单详情
				uni.navigateTo({
					url: e
				});
			},
			onShowPopup() {
				this.isShowPopup = !this.isShowPopup;
			},
			onShowAddTime(e) {
				this.onShowPopup();
				this.workType = e;
				this.isShowAddTime = !this.isShowAddTime;
			},
			onSelectTime(type) {
				if (type === "start") {
					this.isSelectStartTime = !this.isSelectStartTime;
				} else if (type === "end") {
					this.isSelectEndTime = !this.isSelectEndTime;
				}
			},
			confirmTime(e, type) {
				if (type === "start") {
					this.onSelectTime("start");
					this.startTime = e;
					this.onSelectTime("end");
				} else if (type === "end") {
					this.endTime = e;
					this.AddRosterTime();
					this.onSelectTime("end");
				}
			},
			AddRosterTime() {
				if (this.isEditTime) {
					this.addTimeList[this.editIndex].startTime =
						`${this.startTime.year}-${this.startTime.month}-${this.startTime.day} ${this.startTime.hour}:${this.startTime.minute}:00`;
					this.addTimeList[this.editIndex].endTime =
						`${this.endTime.year}-${this.endTime.month}-${this.endTime.day} ${this.endTime.hour}:${this.endTime.minute}:00`
					this.defaultStartTime = undefined;
					this.defaultEndTime = undefined;
					this.editIndex = null;
					this.isEditTime = false;
				} else {
					this.addTimeList.push({
						startTime: `${this.startTime.year}-${this.startTime.month}-${this.startTime.day} ${this.startTime.hour}:${this.startTime.minute}:00`,
						endTime: `${this.endTime.year}-${this.endTime.month}-${this.endTime.day} ${this.endTime.hour}:${this.endTime.minute}:00`
					});
				}
			},
			onHideAddTime() { // 隐藏时间选择面板
				this.isShowAddTime = false;
				this.addTimeList.splice(0, this.addTimeList.length);
			},
			editTime(i) { // 编辑时间
				this.defaultStartTime = this.addTimeList[i].startTime;
				this.defaultEndTime = this.addTimeList[i].endTime;
				this.editIndex = i;
				this.isEditTime = true;
				this.onSelectTime('start')
				console.log(this.addTimeList);
			},
			//取消中途休息时间
			deleteTime() {
				this.$http.delete(this.$api.deleteWorkTime(this.deleteWorkTimeId)).then(res => {					
					this.getWorkHourList();
					this.getStaffInfo();
					uni.$emit('updateStaffList');
					this.$u.toast('取消成功');
				});				
			},
			saveTime() { // 保存时间
				if (this.workType === 0) {
					let param = {
						employeeId: this.staffId,
						times: this.addTimeList
					}
					this.$http.post(this.$api.addStaffWorkTime, param, { isPrompt: false }).then(res => {
							this.$http.put(this.$api.staffUp(this.staffId)).then(qres => {
								this.getWorkHourList();
								this.getStaffInfo();
								uni.$emit('updateStaffList');
								this.$u.toast('排班时间保存成功');
							});
						}).catch(err => {
							if(err.statusCode === "LC1030" && err.errMsg === "抱歉，由于您的保证金余额不足，现无法排班。请及时充值!") {			
								this.errorObj.title = "保证金余额不足";
								this.errorObj.content = "您充值的保证金不足，保证金金额需大于上线员工数 X $100";
								this.errorObj.showCancel = true;
								this.errorObj.confirmText = "去充值";
								this.errorObj.confirmFunc = ()=> { 
									uni.navigateTo({
										url:"../../user/recharge/recharge"
									}) 
								};	
								this.showErrorModal = true;
							} else {								
								uni.showToast({
									title: err.errMsg,
									icon: "none",
									duration: 3000
								});	
							}							
						})
						
				} else {
					let param = {
						employeeId: this.staffId,
						times: this.addTimeList
					}
					this.$http.post(this.$api.addStaffPersonalTime, param, { isPrompt: false}).then(res => {
							this.$u.toast('中途休息时间保存成功');
							if (this.staffInfo.status === 2) this.staffInfo.status = 1;
							this.getWorkHourList();
							uni.$emit('updateStaffList');
						}).catch(err => {
							if(err.statusCode === "LC1006" && err.errMsg === "该时间段已预约") {	
								this.errorObj.title = "保存中途休息时间";
								this.errorObj.content = "您的中途休息时间有客户预约，请进入“消息-订单请求”先取消客户预约，再更改自己的“中途休息时间”。";
								this.errorObj.showCancel = false;
								this.errorObj.confirmText = "确认";
								this.errorObj.confirmFunc = ()=> {  };								
								this.showErrorModal = true;
							} else {								
								uni.showToast({
									title: err.errMsg,
									icon: "none",
									duration: 3000
								});	
							}
						})
				}
				this.onHideAddTime();
			}
		},
		onUnload() {
			uni.$off("autoUpdateByPushMsg");
		}
	};
</script>

<style lang="scss" scoped src="../css/workList.scss"></style>
