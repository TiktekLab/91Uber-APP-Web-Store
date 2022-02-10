<template>
	<view class="bodyMain">
		<u-navbar title="客户详情" />
		<view class="userInfo" v-if="memberInfo">
			<view class="bodyBG"></view>
			<view class="user">
				<view class="avatar flex-center">
					<u-image
						shape="circle"
						width="160"
						height="160"
						v-if="memberInfo && memberInfo.avatar && memberInfo.id"
						:src="memberInfo.avatar || avatarUrl(memberInfo.id)"
						mode="aspectFill"
					/>
				</view>
				<view class="info flex-center padding">
					<text class="name">{{ memberInfo.nickName }}</text>
					<view class="flex-center">
						<text>{{ $t("heartDetails.Ratings") }}: {{ memberInfo.score || "0" }}</text>
						<text class="iconfont icon">&#xe642;</text>
					</view>
				</view>
			</view>
		</view>
		<view class="evaluateList padding">
			<!-- <view class="title flex-start">
				<text class="iconfont stars">&#xe642;</text>
				<text class="text">{{ score !== "null" ? score : "0" }} · {{ evaluationCount }} 评价</text>
			</view> -->
			<view class="listBox">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="getData" :up="upOption">
					<view class="listItem" v-for="(item, index) in evaluationList" :key="index">
						<view class="userInfo flex-start">
							<view class="left">
								<u-image width="82" height="82"  shape="circle" :src="item.photo || avatarUrl(item.memberId)" mode="aspectFill" />
							</view>
							<view class="right">
								<view class="top flex-space-between">
									<text class="name">{{ item.username }}</text>
									<u-rate v-model="item.score" disabled inactive-color="#FFD60A" active-color="#FFD60A" />
								</view>
								<text class="time">{{ formatTime(item.createTime) }}</text>
							</view>
						</view>
						<text class="centent">{{ item.content }}</text>
					</view>
				</mescroll-body>
			</view>
		</view>
	</view>
</template>

<script>
import moment from "moment";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			currentRouterInfo: undefined,
			upOption: {
				textNoMore: "-- 没有更多数据 --",
				noMoreSize: 0,
				toTop: {
					bottom: 200
				}
			},
			staffId: undefined, // 员工id
			memberInfo: {}, //用户信息
			evaluationList: [] //评价标签列表
		};
	},
	onLoad(option) {
		this.staffId = option.id;
		this.getMemberInfo(this.staffId);
		let routes = getCurrentPages();
		this.currentRouterInfo = routes[routes.length - 2]; // 上个页面
	},
	onBackPress(option) {
		console.log('路由信息：',this.currentRouterInfo.route);
		return false;
		const route = "pages/user/evaluate/evaluate";
		if (this.currentRouterInfo.route === route) {
			if (option.from === "navigateBack") {
				return false;
			}
			this.back(2);
			return true;
		} else {
			return false;
		}
	},
	methods: {
		back(index) {
			uni.navigateBack({
				delta: index
			});
		},
		downCallback() {
			// 下拉加载刷新上拉加载
			this.mescroll.resetUpScroll();
		},
		getData(page) {
			let param = {
				pageNum: page.num,
				pageSize: page.size,
				type: 1
			};
			this.$http
				.get(this.$api.evaluationList(this.staffId), param)
				.then(res => {
					if (page.num == 1) this.evaluationList = [];
					this.evaluationList = this.evaluationList.concat(res.list);
					console.log("商家对客户的评价列表：", this.evaluationList);
					this.mescroll.endBySize(res.list.length, res.count);
				})
				.catch(err => {
					this.mescroll.endErr();
				});
		},

		getMemberInfo(staffId) {
			//查询用户信息
			this.$http
				.get(this.$api.memberInfo, {
					memberId: staffId
				})
				.then(res => {
					this.memberInfo = res.memberSimpleVO;
					console.log("客户详情：", this.memberInfo);
				});
		}
	},
	computed: {
		formatTime() {
			return time => {
				if (time) {
					return moment(time.replace("T", " ")).format("DD MMM YYYY");
				}
				return "";
			};
		}
	}
};
</script>

<style lang="scss" scoped src="../css/staffDetails.scss"></style>
