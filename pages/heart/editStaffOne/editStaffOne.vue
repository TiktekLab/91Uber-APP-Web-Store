<template>
	<view class="bodyMain hideScroll">
		<u-navbar title="编辑员工" />
		<view class="avatarBox flex-center" @click="selectAvatar">
			<u-image class="m-icon" id="avatar" :src="addStaffData.avatar || avatarUrl(50)" width="130" height="130" shape="circle" mode="aspectFill" />
			<text class="title flex-center">点击修改头像</text>
		</view>
		<u-form :model="addStaffData" :error-type="['toast']" ref="AddStaff" class="form" label-position="top" :border-bottom="false">
			<u-form-item prop="username" :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">姓名*</text>
						<text class="lable flex tips"></text>
					</view>
					<view class="inputBox m-radius flex-start">
						<input v-model="addStaffData.username" placeholder="请输入姓名" />
						<text class="tips flex padding"></text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="age" :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">年龄*</text>
						<text class="lable flex tips">(请填写18- 80 之间的数字)</text>
					</view>
					<view class="inputBox m-radius flex-start">
						<input v-model="addStaffData.age" placeholder="请输入年龄" type="number" />
						<text class="tips flex padding">岁</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="height" :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">身高*</text>
						<text class="lable flex tips">(请填写140- 200 cm之间的数字)</text>
					</view>
					<view class="inputBox m-radius flex-start">
						<input v-model="addStaffData.height" placeholder="请输入身高" type="number" />
						<text class="tips flex padding">cm</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="weight" :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">体重*</text>
						<text class="lable flex tips">(请填写30- 100 kg之间的数字)</text>
					</view>
					<view class="inputBox m-radius flex-start">
						<input v-model="addStaffData.weight" placeholder="请输入体重" type="number" />
						<text class="tips flex padding">kg</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item :border-bottom="false" v-if="addStaffData.gender === 2">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">胸围*</text>
						<text class="lable flex tips">(单选)</text>
					</view>
					<view class="bustBox hideScroll flex m-radius">
						<text
							:class="['bustItem flex-center', { active: index === bustIndex }]"
							@click="selectItem(index, 'bustId')"
							v-for="(item, index) in bustList"
							:key="index"
						>
							{{ item.content }}
						</text>
					</view>
				</view>
			</u-form-item>
			<u-form-item :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">性别*</text>
						<text class="lable flex tips"></text>
					</view>
					<u-subsection :list="genderList" @change="ChangeGender" :current="gender" />
				</view>
			</u-form-item>
			<view class="lines"></view>
			<u-form-item :border-bottom="false" prop="street">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">模糊地址*</text>
						<text class="lable flex tips">(具体到街号)</text>
					</view>
					<view class="inputBox m-radius flex-start">
						<input @click="navigateToMap" v-model="addStaffData.street" placeholder="请输入模糊地址" />
						<text class="tips flex padding"></text>
					</view>
				</view>
			</u-form-item>
			<u-form-item :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">精确地址</text>
						<text class="lable flex tips">(具体到房间号)</text>
					</view>
					<view class="inputBox m-radius flex-start">
						<input v-model="addStaffData.houseNumber" placeholder-class="holder" placeholder="请输入：房间号/按门铃方式，如无具体房号，请填写“直接进入” " />
						<text class="tips flex padding"></text>
					</view>
				</view>
			</u-form-item>
			<view class="lines"></view>
			<u-form-item :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">堂食价格(按小时)</text>
						<text class="lable flex tips">(建议至少填写一个，且仅为整数)</text>
					</view>
					<view class="priceBox padding m-radius">
						<view v-if="item.type === 0" class="flex-space-between priceItem" v-for="(item, index) in prices" :key="index">
							<text class="text">{{ formatTime(item.minute) }}</text>
							<view class="flex-end">
								<text class="text">$</text>
								<input class="priceInp m-radius" v-model.number="item.price" placeholder="" type="number" />
							</view>
						</view>
					</view>
				</view>
			</u-form-item>
			<u-form-item :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">Outcall价格(按小时)</text>
						<text class="lable flex tips">(建议至少填写一个，且仅为整数)</text>
					</view>
					<view class="priceBox padding m-radius">
						<view v-if="item.type === 1" class="flex-space-between priceItem" v-for="(item, index) in prices" :key="index">
							<text class="text">{{ formatTime(item.minute) }}</text>
							<view class="flex-end">
								<text class="text">$</text>
								<input class="priceInp  m-radius" v-model.number="item.price" placeholder="" type="number" />
							</view>
						</view>
					</view>
				</view>
			</u-form-item>
			<view class="lines"></view>
			<u-form-item :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">选择员工所属的类型</text>
						<text class="lable flex tips">(不可多选)</text>
					</view>
					<view class="serviceBox flex">
						<view
							:class="['flex-center serviceItem m-radius padding', { active: index === classIndex }]"
							@click="selectItem(index, 'classId')"
							v-for="(item, index) in classificationList"
							:key="index"
						>
							<text class="iconfont serviceIcon" v-html="item.icon" />
							<text>{{ item.content }}</text>
						</view>
					</view>
				</view>
			</u-form-item>
			<u-form-item prop="remark" :border-bottom="false">
				<view class="formItem padding">
					<view class="inputLable flex-start">
						<text class="lable flex">自我介绍*</text>
						<text class="lable flex tips">(必须超过100字)</text>
					</view>
					<view class="inputBox textareaBox m-radius flex-start">
						<textarea  v-model="addStaffData.remark" placeholder="请输入自我介绍" maxlength="5000"/>
					</view>
				</view>
			</u-form-item>
		</u-form>
		<view :class="['PreciseSearch padding ', { isAndroid: isAndroid }]">
			<u-button hover-class="none" plain class="searchBtn pink m-btn" @click="nextStep">保存并前往下一页</u-button>
		</view>
	</view>
</template>
<script>
import moment from "moment";
import { uploadFile } from "@/common/js/filerequest.js";
const rules = require("@/common/js/addStaffRules.js"); // 表单校验
export default {
	onReady() {
		this.$refs.AddStaff.setRules(this.rules);		
		const that = this;
		//重点: 监听子页面uni.postMessage返回的值
		plus.globalEvent.addEventListener("plusMessage", function(msg) {
			if (msg.data.args.data.name == "postMessage") {
				console.log("子页面返回的数据为:" + JSON.stringify(msg.data.args.data.arg));
				const { option, street, city, province, region, postcode, location } = msg.data.args.data.arg;
				if (option === "add") {
					that.addStaffData.street = street;
					that.addStaffData.city = city;
					that.addStaffData.province = province;
					that.addStaffData.region = region;
					that.addStaffData.longitude = location.lng;
					that.addStaffData.latitude = location.lat;
				}
			}
		});
	},
	async onLoad(option) {
		await this.getData();
		this.staffId = option.id;
		if (this.staffId) {
			await this.getStaffInfo();
		}
		this.initSelectData();
	},
	data() {
		return {
			rules, // 表单验证
			staffId: null, // 员工id
			genderList: [
				{
					name: "男"
				},
				{
					name: "女"
				}
			],
			bustList: [],
			bustIndex: null, // 当前选中的胸围
			classificationList: [],
			classIndex: null, // 当前选中的类型
			gender: 1, // 性别
			addStaffData: {
				username: null, // 姓名
				age: null, // 年龄
				height: null, // 身高
				weight: null, // 体重
				bustId: null, // 胸围
				avatar: null, // 头像
				gender: 2, // 性别
				street: null, // 模糊地址
				province: null, //州(state)
				region: null, //country
				city: null, //市(区)
				houseNumber: null, // 精确地址
				longitude: null, // 经度
				latitude: null, // 纬度
				prices: [], // 价格
				remark: null // 自我介绍
			},
			pageInfo: {
				pageNum: 1,
				pageSize: 100
			},
			prices: [
				{
					price: null,
					type: 0,
					minute: 30
				},
				{
					price: null,
					type: 0,
					minute: 60
				},
				{
					price: null,
					type: 0,
					minute: 120
				},
				{
					price: null,
					type: 1,
					minute: 60
				},
				{
					price: null,
					type: 1,
					minute: 120
				},
				{
					price: null,
					type: 1,
					minute: 600
				}
			],
			staffInfo: undefined // 员工详情
		};
	},
	methods: {
		async getData() {
			await this.$http.get(this.$api.bustList, this.pageInfo).then(res => {
				this.bustList = res.list;
				//console.log("胸围：", res.list);
			});
			await this.$http.get(this.$api.classificationList, this.pageInfo).then(res => {
				this.classificationList = res.list;
				//console.log("类型：", this.classificationList);
			});
		},
		async getStaffInfo() {
			await this.$http.get(this.$api.staffDetails + this.staffId).then(res => {
				this.staffInfo = res.employee;
				uni.setStorageSync("staffDetails", this.staffInfo);
				this.gender = this.staffInfo.gender - 1; // 回填胸围信息
				//console.log("员工详情：", this.staffInfo);
			});
		},
		initSelectData() {
			// 数据回填操作
			this.bustList.map((it, i) => {
				if (it.id === this.staffInfo.bustId) {
					this.bustIndex = i;
				}
			});
			this.classificationList.map((it, i) => {
				if (it.id === this.staffInfo.classificationIds[0]) {
					this.classIndex = i;
				}
			});
			this.prices.map((item, index) => {
				this.staffInfo.prices.map((it, i) => {
					if (item.type === it.type && item.minute == it.minute) {
						item.price = it.price;
					}
				});
			});
			for (let key in this.addStaffData) {
				this.addStaffData[key] = this.staffInfo[key];
			}
		},
		selectItem(index, type) {
			if (type === "bustId") {
				this.bustIndex = index;
			} else if (type === "classId") {
				this.classIndex = index;
			}
		},
		navigateToMap() {
			//google地图页面搜索地址
			let navUrl = "../../user/mapAddress/mapAddress?option=add&googleKey=" + this.$base.googleMapAPIKey;
			if (this.addStaffData.street) {
				navUrl += "&address=" + encodeURIComponent(this.addStaffData.street);
			}
			uni.navigateTo({
				url: navUrl
			});
		},
		ChangeGender(e) {
			console.log("性别：", e + 1);
			this.addStaffData.gender = e + 1;
		},
		selectAvatar() {
			// 选择头像
			const that = this;
			uni.chooseImage({
				count: 1,
				success: e => {
					this.addStaffData.avatar = e.tempFilePaths[0];
					uploadFile({
						url: this.$api.imgUpload,
						filePath: e.tempFilePaths[0],
						name: "file",
						formData: {
							folderPath: "danners"
						},
						loading: true,
						success: res => {
							that.addStaffData.avatar = "https://" + res.result;
						},
						fail: err => {
							uni.showToast({
								title: "头像上传失败",
								icon: "none",
								success() {
									that.addStaffData.avatar = undefined;
								}
							});
						}
					});
				}
			});
		},
		nextStep() {
			this.$refs.AddStaff.validate(res => {
				if (res) {
					const bustIndex = this.bustIndex ?? -1;
					if (this.addStaffData.gender === 2 && bustIndex < 0) return this.$u.toast("请选择胸围");
					if (!this.classIndex && this.classIndex !== 0) return this.$u.toast("请选所属服务类型");
					if (!this.addStaffData.avatar) return this.$u.toast("请选择头像");
					this.addStaffData.bustId = this.addStaffData.gender === 2 ? Number(this.bustList[bustIndex].id) : null;
					this.addStaffData.classificationIds = [this.classificationList[this.classIndex].id];	
					//console.log("价格", this.prices);
					if (this.prices.every(item => !item.price)) {
						return this.$u.toast("在堂食价格和outcall中，请至少填写一个时间段的收费标准");						
					}					
				    if (this.prices.some(item => item.price && item.price < 10)) {
						return this.$u.toast("在堂食价格和outcall中，请至少填写一个时间段的收费标准，且收费金额需大于10");
				    }
					this.addStaffData.prices = this.prices.filter(item => item.price && item.price >= 10);
					//console.log("修改员工校验成功", this.addStaffData);
					const that = this;
					uni.navigateTo({
						url: `../editStaffTwo/editStaffTwo?id=${this.staffId}`,
						success(res) {
							res.eventChannel.emit("editStaffOne", that.addStaffData);
						}
					});
				} else {
					console.log("注册校验失败", this.addStaffData);
					// uni.navigateTo({
					// 	url:'../editStaffTwo/editStaffTwo'
					// })
				}
			});
		}
	},
	computed: {
		formatTime() {
			return time => {
				if (time < 60) {
					return time + "分钟";
				} else if (time === 600) {
					return moment.utc(moment.duration(time, "minutes").asMilliseconds()).format("h") + "小时";
				} else {
					return moment.utc(moment.duration(time, "minutes").asMilliseconds()).format("h") + "小时";
				}
			};
		}
	}
};
</script>
<style lang="scss" scoped src="../css/addStaffOne.scss"></style>
