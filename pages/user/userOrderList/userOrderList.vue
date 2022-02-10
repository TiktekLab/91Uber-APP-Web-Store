<template>
	<view class="bodyMain bodyBG">
		<u-navbar title="我的订单" />
		<view class=" subSection">
			<u-subsection :list="orderStatus" @change="sectionChange" active-color="#ff36a2" :current="tabCurrent"
				font-size="26rpx" bg-color="rgba(0,0,0,.1)" />
			<view class="search flex-start" @click="searchEvent">
				<view class=" searchIconBox flex-center">
					<text class="iconfont searchIcon">&#xe60a;</text>
				</view>
				<input v-model="searchData" class="input " @confirm="searchEvent" placeholder="搜索女生名称或订单号" />
			</view>
		</view>
		<view class="orderList">
			<mescroll-body offset="300" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="getData"
				:up="upOption">
				<view class="listItem" v-for="(item, index) in orderList" :key="index" @click="navigateTo(item)">
					<view class="avatar ">
						<image class="m-icon" :src="item.employeeAvatar" mode="aspectFill" />
						<view class="tagBox flex-space-between">
							<view class="left flex-start"><text
									class="flex-center tag">{{ item.orderType ? '外卖' : '堂食' }}</text></view>
						</view>
					</view>
					<view class="staffInfo">
						<view class="nameBox flex-space-between ">
							<text class="name">{{item.employeeName}}</text>
							<text class="status" v-if="item.orderType === 0">{{item.status|orderStatusTxt}}</text>
							<text class="status" v-if="item.orderType === 1">{{item.status|outCallStatus}}</text>
						</view>
						<view class="infos flex-start"><text
								class="flex-center">{{item.startTime|timeDate}}-{{item.endTime|timeHm}}</text>
						</view>
					</view>
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				upOption: {
					textNoMore: "-- 没有更多数据 --",
					noMoreSize: 0,
				},
				searchData: "",
				orderStatus: [{
						name: "进行中（0）"
					},
					{
						name: "历史订单"
					}
				],
				tabCurrent: 0, // 当前选中的tab
				orderList: [] // 订单数据
			};
		},
		onReady() {			
			uni.$on("autoUpdateByPushMsg", () => {
				this.downCallback();
			});
		},
		methods: {
			// 下拉加载刷新上拉加载
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			getData(page) {
				// 历史订单
				const params = {
					isFinish: this.tabCurrent,
					pageNum: 1,  //去重需要，一直传1
					pageSize: page.size
				}
				if (this.searchData) params.search = this.searchData;
				if (page.num > 1){					
					if(this.tabCurrent === 0) {
						params.idMax = this.orderList[this.orderList.length-1].id;
					} else {
						params.updateTimeMax = this.orderList[this.orderList.length-1].updateTime;
					}
				}
				this.$http.get(this.$api.orderList, params).then(res => {
						if (page.num == 1) this.orderList = []; //如果是第一页需手动置空列表
						this.orderList = this.orderList.concat(res.list);
						//console.log('订单列表：',this.orderList);
						this.mescroll.endBySize(res.list.length, res.count);
						if (this.tabCurrent === 0) {
							this.$set(this.orderStatus[0], "name", `进行中（${res.count}）`);
						}
					}).catch(err => {
						this.mescroll.endErr();
					});
			},
			navigateTo(order) {
				uni.navigateTo({
					url: '../orderDetails/orderDetails?orderId=' + order.id
				})
			},
			searchEvent() {
				this.getData({
					num: 1,
					size: 10
				});
			},
			sectionChange(e) {
				this.tabCurrent = e
				this.getData({
					num: 1,
					size: 10
				});
			}
		},
		onUnload() {
			uni.$off("autoUpdateByPushMsg");
		}
	};
</script>

<style lang="scss" scoped src="../css/userOrderList.scss"></style>
