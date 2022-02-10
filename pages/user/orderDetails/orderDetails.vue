<template>
	<view class="bodyMain hideScroll">
		<u-navbar :title="pageTitle" title-width="350"/>
		<staffDetails :staffDetails="staffInfo" :memberDetails="memberInfo" :staffEvent="staffEvent" />
		<view class="orderDetails padding">
			<view class="orderStatus flex-start m-radius">
				<text>{{ statusTxt() }}</text>
			</view>
			<text class="orderId flex">订单号：{{ orderDetails.orderSerial }}</text>
			<view class="itemList">
				<text class="pageTitle">预约类型</text>
				<view class="centent flex">
					<text>{{ orderType === 0 ? "堂食" : "外卖 Outcall" }}</text>
				</view>
			</view>
			<view class="itemList">
				<text class="pageTitle">预约日期</text>
				<view class="centent flex">
					<text>{{ formatDate(orderDetails.startTime) }}</text>
				</view>
			</view>
			<view class="itemList">
				<text  :class="['pageTitle',{pink:orderType === 0}]">{{ orderType === 0 ? "约会地址" : "客户联系方式及地址" }}</text>
				<view class="centent flex" v-if="orderType === 1">
					<text>{{ orderDetails.receiverName }} {{ orderDetails.receiverPhone }}</text>
					<text>{{ orderType === 1 ? orderDetails.receiverAddress : orderDetails.receiverVagueAddress }}</text>
				</view>
				<view class="centent flex" v-else>
					<text>{{ orderDetails.receiverAddress ? orderDetails.receiverAddress : orderDetails.receiverVagueAddress }}</text>
				</view>
			</view>
			<view class="itemList">
				<text class="pageTitle">预约时间</text>
				<view class="centent flex">
					<text>{{ formatTime(orderDetails.startTime) }} - {{ formatTime(orderDetails.endTime) }}</text>
					<text>共计：{{ allPrice(orderDetails.endTime, orderDetails.startTime) }} 分钟</text>
					<text>总价：{{ formatPrice(orderDetails.price) }}</text>
					<text>定金：{{ formatPrice(orderDetails.bond) }}</text>
					<text v-if="orderType === 0">支付商家：{{ formatPrice(orderDetails.price - orderDetails.bond) }}</text>
					<text v-else>支付商家：{{ formatPrice(orderDetails.bond / 2) }}</text>
					<!-- <text>定金：{{ deposit.isRatio ? formatPrice(orderDetails.price * deposit.bond / 100) : deposit.bond }}</text>
					<text>支付商家：{{ deposit.isRatio ? formatPrice(orderDetails.price * (1- deposit.bond / 100)) : orderDetails.price - deposit.bond }}</text> -->
					<text>(此费用不包括外卖的车油费)</text>
				</view>
			</view>
		</view>
		<view class="Tips">
			<text v-if="orderType === 0">
				温馨提示：
				<br />
				“我已到达”按钮将在约会开始前15分钟启动。
				<br />
				请客户按照预约时间准时到达约会地址，迟到有可能取消您的订单，请点击“我已到达”获取房号。
				<br />
				请商家注意订单状态更新，及时发送房号。
				<br />
				约会开始前，客户请第一时间检查约会对象已年满18岁和相关工作许可证明，商家收取订单余额。
				<br />
				如有其他问题请查看91UBER相关新手指南。			
			</text>
			<text v-else>
				温馨提示：
				<br />
				如有订单变更，请商家第一时间联系客户并进行协商，到达后请立刻要求客户支付订单余额并点击“员工已到达”。
				<br />
				约会开始前，客户请第一时间检查约会对象已年满18岁和相关工作许可证明。
				<br />
				如有其他问题请查看91UBER相关新手指南。
			</text>
		</view>
		<!-- orderType: 0 堂食订单 -->
		<view v-if="orderType === 0" :class="['footerBtn padding ', { isAndroid: isAndroid }]">
			<view class="flex-end" v-if="orderDetails.status === 0">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="isModal('0')">拒绝</u-button>
				<u-button hover-class="none" plain class="btn pink m-btn" @click="isModal('1')">接受</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 1">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="isModal('2')">取消预约</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 2">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="isModal('2')">取消预约</u-button>
				<u-button hover-class="none" plain class="btn pink m-btn" @click="isModal('3')">发送房号</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 3">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="isModal('2')">取消预约</u-button>
				<u-button v-if="orderDetails.isBegin" hover-class="none" plain class="btn disable pink m-btn">开始服务</u-button>
				<u-button v-else hover-class="none" plain class="btn pink m-btn" @click="isModal('4')">开始服务</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 4">				
				<u-button v-if="orderDetails.isBegin" hover-class="none" plain class="btn disable pink m-btn">开始服务</u-button>
				<u-button v-else hover-class="none" plain class="btn pink m-btn" @click="isModal('4')">开始服务</u-button>
				<u-button v-if="orderDetails.isCanEnd" hover-class="none" plain class="btn pink m-btn" @click="isModal('5')">完成服务</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 5">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="aboutUs()">联系客服</u-button>
				<u-button v-if="!orderDetails.score" hover-class="none" plain class="btn plain pink m-btn" @click="isModal('6')">前往评价</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 6">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="aboutUs()">联系客服</u-button>
			</view>
		</view>
		<!-- orderType: 1 外卖订单 -->
		<view v-else :class="['footerBtn padding ', { isAndroid: isAndroid }]">
			<view class="flex-end" v-if="orderDetails.status === 0">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="isModal('0')">拒绝</u-button>
				<u-button hover-class="none" plain class="btn pink m-btn" @click="isModal('1')">接受</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 1">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="isModal('2')">取消预约</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 4">	
				<u-button v-if="orderDetails.isCanEnd" hover-class="none" plain class="btn pink m-btn" @click="isModal('5')">完成服务</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 5">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="aboutUs()">联系客服</u-button>
				<u-button v-if="!orderDetails.score" hover-class="none" plain class="btn plain pink m-btn" @click="isModal('6')">前往评价</u-button>
			</view>
			<view class="flex-end" v-else-if="orderDetails.status === 6">
				<u-button hover-class="none" plain class="btn plain pink m-btn" @click="aboutUs()">联系客服</u-button>
			</view>
		</view>
		<!-- 弹框 -->
		<u-modal v-model="isShowModal" :content="content" :title="title" show-cancel-button @confirm="Confirm" />
	</view>
</template>

<script>
import moment from "moment";
import staffDetails from "@/component/staffDetails/staffDetails.vue";
import { updateSetLoginUserInfo } from "@/common/js/storeCommon.js";
//取消订单1小时以内或者以外
const criticalHour = 60 * 60 * 1000;
export default {
	components: {
		staffDetails
	},
	data() {
		return {
			orderId: undefined,
			workTimeId: undefined,
			orderDetails: {},
			memberInfo: {},
			staffInfo: {},
			orderType: 0, // 订单类型
			isShowModal: false, // 是否显示提醒弹框
			content: "确认后商家将会发送精确地址", // 消息弹框内容
			title: "确认到达", // 消息弹框标题
			modalType: undefined,
			deposit: {},
		};
	},
	onLoad(option) {
		this.orderId = option.orderId;
		this.workTimeId = option.workTimeId;
		this.getOrder();
	},
	onReady() {
		uni.$on("autoUpdateByPushMsg", () => {
			this.getOrder();
		});		
	},
	onUnload() {
		uni.$off("autoUpdateByPushMsg");
	},
	methods: {
		getConfigBond() {
			const api = this.orderDetails.orderType === 0 ? this.$api.getBond : this.$api.getBondOutCall;
			this.$http.get(api).then(res => {
				this.deposit = res;
			});
		},
		getOrder() {
			const api = this.orderId ? this.$api.orderDetails + this.orderId : this.$api.orderDetailsByWorkTimeId(this.workTimeId);
			this.$http.get(api).then(res => {
				this.orderDetails = res.labourOrder;
				//console.log('***** 订单详情 *****',this.orderDetails);	
				this.orderType = this.orderDetails.orderType;
				//this.getConfigBond();
				this.getEmployeeSimple(this.orderDetails.employeeId);
				this.getMemberInfo(this.orderDetails.memberId);
			});
		},
		getEmployeeSimple(staffId) {
			this.$http.get(this.$api.employeeSimple(staffId)).then(res => {
				this.staffInfo = res.employee;
			});
		},
		getMemberInfo(memberId) {
			this.$http.get(this.$api.memberInfo, {
					memberId: memberId
				}).then(res => {
					this.memberInfo = res.memberSimpleVO;
				});
		},
		staffEvent(id, type) {
			if (type === 2) {
				uni.navigateTo({
					// 员工详情
					url: "../../heart/workList/workList?data=" + id
				});
			} else {
				uni.navigateTo({
					// 客户详情
					url: `../staffDetails/staffDetails?id=${id}`
				});
			}
		},
		isModal(e) {
			this.modalType = e;
			switch (this.modalType) {
				case "0":
					this.title = "拒绝接单";
					this.content = "是否拒绝接单";
					break;
				case "1":
					this.title = "同意接单";
					this.content = "是否同意接单";
					break;
				case "2":
					this.title = "取消接单";					
					const nowTime = moment();
					const orderStart = moment(this.orderDetails.startTime.replace("T", " "));
					const diffTime = orderStart.diff(nowTime);
					if(this.orderType === 0){
						this.content = diffTime > criticalHour ? "您是否确认要取消此订单？" : "您是否确认要取消此订单，如果取消将扣除$50保证金？";
					} else {
						this.content = diffTime > criticalHour ? "您是否确认要取消此订单？" : "您是否确认要取消此订单？距离预约时间开始短于1个小时取消订单将扣除$50保证金。";
					}					
					break;
				case "3":
					this.title = "发送房号";
					this.content = "点击确认发送房号后，客户会立刻上门，请再次确认是否准备完毕。";
					break;
				case "4":
					this.title = "开始服务";
					this.content = "是否开始服务";
					break;
				case "5":
					this.title = "完成服务";
					this.content = "是否完成服务";
					break;
				case "6":
					this.title = "前往评价";
					this.content = "确认前往评价";
					break;
				case "7":
					this.title = "联系客服";
					this.content = "确认后联系客服";
					break;
			}
			this.isShowModal = !this.isShowModal;
		},
		Confirm() {
			switch (this.modalType) {
				case "0":
					this.disagreeOrder();
					break;
				case "1":
					this.agreeOrder();
					break;
				case "2":
					this.orderCancel();
					break;
				case "3":
					this.sendFullAddress();
					break;
				case "4":
					this.orderBegin();
					break;
				case "5":
					this.orderComplete();
					break;
				case "6":
					this.evaluate();
					break;
				case "7":
					this.aboutUs();
					console.log("联系客服");
					break;
			}
		},
		aboutUs() {
			// 联系客服
			uni.navigateTo({
				url: "../contactUs/contactUs"
			});
		},
		agreeOrder() {
			this.$http.post(this.$api.agreeOrder(this.orderId)).then(res => {
				this.getOrder();
			});
		},
		disagreeOrder() {
			this.$http.post(this.$api.disagreeOrder(this.orderId)).then(res => {
				this.getOrder();
			});
		},
		orderCancel() {
			this.$http.post(this.$api.orderCancel(this.orderId)).then(res => {				
				this.getOrder();
				updateSetLoginUserInfo();
			});
		},
		sendFullAddress() {
			this.$http.post(this.$api.sendFullAddress(this.orderId)).then(res => {
				this.getOrder();
				uni.$emit("updateMessage", {
					reset: true,
					noticeType: 2
				});
			});
		},
		orderBegin() {
			this.$http.put(this.$api.orderStart(this.orderId)).then(res => {
				this.getOrder();
			});
		},
		orderComplete() {
			this.$http.post(this.$api.orderComplete(this.orderId)).then(res => {
				this.getOrder();
			});
		},
		evaluate() {
			uni.navigateTo({
				url: "../evaluate/evaluate?orderId=" + this.orderId + "&memberId=" + this.orderDetails.memberId
			});
		},
		formatDate(time) {
			if (time) {
				return moment(time.replace("T", " ")).locale("zh-cn").format("ddd MMM DD日 yyyy");
			}
			return "";
		},
		formatTime(time) {
			if (time) {
				return moment(time.replace("T", " ")).format("HH:mm DD/MM/yyyy");
			}
			return "";
		},
		diff(startTime, endTime) {
			if (startTime && endTime) {
				return moment(endTime.replace("T", " ")).diff(moment(startTime.replace("T", " ")), "h");
			}
			return 0;
		}
	},
	computed: {
		allPrice() {
			return (end, start) => {
				return moment(end).diff(moment(start), "minutes");
			};
		},
		pageTitle() {
			if (Number(this.orderType) === 0) {
				return "堂食-订单详情";
			}
			return "外卖 Outcall-订单详情";
		},
		statusTxt() {
			//5.6历史订单，其它进行中订单
			return () => {
				let status = this.orderDetails.status;
				if (this.orderType === 0) {
					switch (status) {
						case 0:
							return `等待${this.orderDetails.employeeName}确认订单`;
						case 1:
							return "订单已确认";
						case 2:
							return "等待发送房号";
						case 3:
							return "等待客户上门";
						case 4:
							if(!this.orderDetails.isBegin) return "等待客户上门";
							return "订单已确认";
						case 5:
							return "订单已完成";
						case 6:
							return "订单已取消";
						default:
							return "";
					}
				} else {
					switch (status) {
						case 0:
							return `等待${this.orderDetails.employeeName}确认订单`;
						case 1:
							return "订单已确认";
						case 4:
							return "订单已确认";
						case 5:
							return "订单已完成";
						case 6:
							return "订单已取消";
						default:
							return "";
					}
				}
			};
		}
	}
};
</script>

<style lang="scss" scoped src="../css/orderDetails.scss"></style>
