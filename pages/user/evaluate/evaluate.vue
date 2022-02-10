<template>
	<view class="bodyMain">
		<u-navbar title="评价客户" />
		<view class="flex-space-between staffDetails padding">
				<u-image  shape="circle" width="100" height="100" :src="memberInfo.avatar" mode="aspectFill" />
				<view class="flex-space-between info">
					<view class="left flex">
						<view class="flex-start">
							<text class="name">{{memberInfo.nickName}}</text>
							<view class="rate flex-start">
								<text class="iconfont icon">&#xe642;</text>
								<text class="count">{{memberInfo.score}}</text>
							</view>
						</view>
						<!-- <text>{{memberInfo.boundPhone}}</text> -->
					</view>
				</view>
		</view>
		<view class="evaluate padding">
			<view class="flex-space-between">
				<text class="pageTitle">请为此次服务评分*</text>
				<u-rate v-model="rateVal" size="36" @change="rate" active-color="#FFD60A" inactive-color="#FFD60A" />
			</view>
			<view class="evaluateList">
				<text class="pageTitle">请为您的体验留下最真实的评价</text>
				<!-- <view class="itemContent flex">
					<view :class="['tag', 'flex-center', { active: item.checked }]" v-for="(item, index) in evaluateList" :key="index" @click="tabClick(item)">
						<text class="flex-center m-radius">{{ item.content }}</text>
					</view>
				</view> -->
				<view class="flex-center textareaBox  m-radius">
					<textarea v-model="evaluateVal" class="textarea"  placeholder="请在此输入..." maxlength="-1" />
				</view>
			</view>
		</view>
		<view class="footerBtn flex-end"><u-button hover-class="none" plain class="btn  pink m-btn" @click="Submit">提交评价</u-button></view>
		<u-modal v-model="isShowModal" content="您的评价已提交，欢迎继续使用91Uber" title="谢谢您的评价" confirm-text="返回" @confirm="Confirm"></u-modal>
	</view>
</template>

<script>
import staffDetails from '@/component/staffDetails/staffDetails.vue';
export default {
	components: {
		staffDetails
	},
	onLoad(option) {
		this.orderId = option.orderId;
		this.memberId = option.memberId;
		this.getMemberInfo();
		this.evaluationLabelsList();
	},
	data() {
		return {
			memberId: undefined,
			orderId: undefined,
			memberInfo: {},
			rateVal: undefined, // 评分
			evaluateVal: undefined, // 评价内容
			isShowModal: false, // 是否显示提醒弹框
			evaluateList: []
		};
	},
	methods: {
		getMemberInfo() {
			if(this.memberId) {
				this.$http.get(this.$api.memberInfo, { memberId: this.memberId }).then(res => {
						this.memberInfo = res.memberSimpleVO;
				})				
			} else {
				this.$http.get(this.$api.orderDetails + this.orderId).then(res => {
					this.$http.get(this.$api.memberInfo, { memberId: res.labourOrder.memberId }).then(res => {
							this.memberInfo = res.memberSimpleVO;
					})	
				})			
			}
		},
		evaluationLabelsList() {  // 评论标签
			this.$http.get(this.$api.evaluationLabelsList, {type: 0}).then(res => {
					this.evaluateList = res.list;
			})
		},
		tabClick(item) {
			this.$set(item, 'checked', !item.checked);
		},
		rate(e) {
			this.rateVal = e
		},
		Submit() {
			// let labelIds = this.evaluateList.filter(e => e.checked).map(e => e.id)
			const param = {
				orderId: this.orderId,
				content: this.evaluateVal,
				score: this.rateVal,
				// evaluationLabelIds: labelIds
			}
			this.$http.post(this.$api.orderScoreByStaff, param).then(res => {
				this.isShowModal = !this.isShowModal;
				uni.$emit('updateGetOrder')
				uni.$emit("updateMessage", {
					reset: true,
					noticeType:2
				});
			})
		},
		Confirm() {
			console.log('员工id***********************************：',this.memberId);
			uni.navigateTo({
				url:"../userOrderList/userOrderList"
			})
			// uni.navigateTo({
			// 	url: '../staffDetails/staffDetails?id=' + this.memberId
			// });			
		}
	}
};
</script>

<style lang="scss" scoped src="../css/evaluate.scss"></style>
