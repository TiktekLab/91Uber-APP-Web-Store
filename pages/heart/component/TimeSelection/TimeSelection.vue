<template>
	<u-popup :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto" :safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex">
		<view class="u-datetime-picker">
			<view class="u-picker-header" @touchmove.stop.prevent="">
				<view class="u-btn-picker u-btn-picker--tips" 
					:style="{ color: cancelColor }" 
					hover-class="u-opacity" 
					:hover-stay-time="150" 
					@tap="getResult('cancel')"
				>{{cancelText}}</view>
				<view class="u-picker__title">{{ title }}</view>
				<view
					class="u-btn-picker u-btn-picker--primary"
					:style="{ color: confirmColor }"
					hover-class="u-opacity"
					:hover-stay-time="150"
					@touchmove.stop=""
					@tap.stop="getResult('confirm')"
				>
					{{confirmText}}
				</view>
			</view>
			<view class="u-picker-body">
				<picker-view v-if="mode == 'time'" :value="valueArr" @change="change" class="u-picker-view" >
					<picker-view-column v-if="!reset && params.year">
						<view class="u-column-item" v-for="(item, index) in years" :key="index">
							{{ item }}
							<text class="u-text" v-if="showTimeTag">年</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset && params.month">
						<view class="u-column-item" v-for="(item, index) in months" :key="index">
							{{ formatNumber(item) }}
							<text class="u-text" v-if="showTimeTag">月</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset && params.day">
						<view class="u-column-item" v-for="(item, index) in days" :key="index">
							{{ formatNumber(item) }}
							<text class="u-text" v-if="showTimeTag">日</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset && params.hour">
						<view class="u-column-item" v-for="(item, index) in hours" :key="index">
							{{ formatNumber(item) }}
							<text class="u-text" v-if="showTimeTag">时</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!reset && params.minute">
						<view class="u-column-item" v-for="(item, index) in minutes" :key="index">
							{{ formatNumber(item) }}
							<text class="u-text" v-if="showTimeTag">分</text>
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</u-popup>
</template>

<script>

export default {
	name: 'TimeSelection',
	props: {
		// picker中需要显示的参数
		params: {
			type: Object,
			default() {
				return {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
				};
			}
		},
		// 模式选择，region-地区类型，time-时间类型，selector-单列模式，multiSelector-多列模式
		mode: {
			type: String,
			default: 'time'
		},
		// 年份开始时间
		startYear: {
			type: [String, Number],
			default: 1950
		},
		// 年份结束时间
		endYear: {
			type: [String, Number],
			default: 2050
		},
		// "取消"按钮的颜色
		cancelColor: {
			type: String,
			default: '#606266'
		},
		// "确定"按钮的颜色
		confirmColor: {
			type: String,
			default: '#ff36a2'
		},
		// 默认显示的时间，2025-07-02 || 2025-07-02 13:01:00 || 2025/07/02
		defaultTime: {
			type: String,
			default: ''
		},
		// 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
		defaultRegion: {
			type: Array,
			default() {
				return [];
			}
		},
		// 时间模式时，是否显示后面的年月日中文提示
		showTimeTag: {
			type: Boolean,
			default: true
		},
		// 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
		areaCode: {
			type: Array,
			default() {
				return [];
			}
		},
		safeAreaInsetBottom: {
			type: Boolean,
			default: false
		},
		// 是否允许通过点击遮罩关闭Picker
		maskCloseAble: {
			type: Boolean,
			default: true
		},
		// 通过双向绑定控制组件的弹出与收起
		value: {
			type: Boolean,
			default: false
		},
		// 弹出的z-index值
		zIndex: {
			type: [String, Number],
			default: 0
		},
		// 顶部标题
		title: {
			type: String,
			default: ''
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确认'
		}
	},
	data() {
		return {
			years: [],
			months: [],
			days: [],
			hours: [],
			minutes: [],
			year: 0,
			month: 0,
			day: 0,
			hour: 0,
			minute: 0,
			reset: false,
			startDate: '',
			endDate: '',
			valueArr: [],
			area: 0,
		};
	},
	mounted() {
		this.init();
	},
	computed: {
		propsChange() {
			// 引用这几个变量，是为了监听其变化
			return `${this.mode}-${this.defaultTime}-${this.startYear}-${this.endYear}-${this.defaultRegion}-${this.areaCode}`;
		},
		yearAndMonth() {
			return `${this.year}-${this.month}`;
		},
		uZIndex() {
			// 如果用户有传递z-index值，优先使用
			return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
		}
	},
	watch: {
		propsChange() {
			this.reset = true;
			setTimeout(() => this.init(), 10);
		},
		// 如果地区发生变化，为了让picker联动起来，必须重置this.citys和this.areas
		// watch监听月份的变化，实时变更日的天数，因为不同月份，天数不一样
		// 一个月可能有30，31天，甚至闰年2月的29天，平年2月28天
		yearAndMonth(val) {
			if (this.params.year) this.setDays();
		},
		// 微信和QQ小程序由于一些奇怪的原因(故同时对所有平台均初始化一遍)，需要重新初始化才能显示正确的值
		value(n) {
			if (n) {
				this.reset = true;
				setTimeout(() => this.init(), 10);
			}
		}
	},
	methods: {
		// 小于10前面补0，用于月份，日期，时分秒等
		formatNumber(num) {
			return +num < 10 ? '0' + num : String(num);
		},
		// 生成递进的数组
		generateArray: function(start, end) {
			// 转为数值格式，否则用户给end-year等传递字符串值时，下面的end+1会导致字符串拼接，而不是相加
			start = Number(start);
			end = Number(end);
			end = end > start ? end : start;
			// 生成数组，获取其中的索引，并剪出来
			return [...Array(end + 1).keys()].slice(start);
		},
		getIndex: function(arr, val) {
			let index = arr.indexOf(val);
			// 如果index为-1(即找不到index值)，~(-1)=-(-1)-1=0，导致条件不成立
			return ~index ? index : 0;
		},
		//日期时间处理
		initTimeValue() {
			// 格式化时间，在IE浏览器(uni不存在此情况)，无法识别日期间的"-"间隔符号
			let fdate = this.defaultTime.replace(/\-/g, '/');
			fdate = fdate && fdate.indexOf('/') == -1 ? `2020/01/01 ${fdate}` : fdate;
			let time = null;
			if (fdate) time = new Date(fdate);
			else time = new Date();
			// 获取年日月时分秒
			this.year = time.getFullYear();
			this.month = Number(time.getMonth()) + 1;
			this.day = time.getDate();
			this.hour = time.getHours();
			this.minute = '0';
		},
		init() {
			this.valueArr = [];
			this.reset = false;
			if (this.mode == 'time') {
				this.initTimeValue();
				if (this.params.year) {
					this.valueArr.push(0);
					this.setYears();
				}
				if (this.params.month) {
					this.valueArr.push(0);
					this.setMonths();
				}
				if (this.params.day) {
					this.valueArr.push(0);
					this.setDays();
				}
				if (this.params.hour) {
					this.valueArr.push(0);
					this.setHours();
				}
				if (this.params.minute) {
					this.valueArr.push(0);
					this.setMinutes();
				}
				
			} 
			this.$forceUpdate();
		},
		// 设置picker的某一列值
		setYears() {
			// 获取年份集合
			this.years = this.generateArray(this.startYear, this.endYear);
			// 设置this.valueArr某一项的值，是为了让picker预选中某一个值
			this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.years, this.year));
		},
		setMonths() {
			this.months = this.generateArray(1, 12);
			this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.months, this.month));
		},
		setDays() {
			let totalDays = new Date(this.year, this.month, 0).getDate();
			this.days = this.generateArray(1, totalDays);
			let index = 0;
			// 这里不能使用类似setMonths()中的this.valueArr.splice(this.valueArr.length - 1, xxx)做法
			// 因为this.month和this.year变化时，会触发watch中的this.setDays()，导致this.valueArr.length计算有误
			if (this.params.year && this.params.month) index = 2;
			else if (this.params.month) index = 1;
			else if (this.params.year) index = 1;
			else index = 0;
			// 当月份变化时，会导致日期的天数也会变化，如果原来选的天数大于变化后的天数，则重置为变化后的最大值
			// 比如原来选中3月31日，调整为2月后，日期变为最大29，这时如果day值继续为31显然不合理，于是将其置为29(picker-column从1开始)
			if(this.day > this.days.length) this.day = this.days.length;
			this.valueArr.splice(index, 1, this.getIndex(this.days, this.day));
		},
		setHours() {
			this.hours = this.generateArray(0, 23);
			this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.hours, this.hour));
		},
		setMinutes() {
			this.minutes = [0,30];
		},
		close() {
			this.$emit('input', false);
		},
		// 用户更改picker的列选项
		change(e) {
			this.valueArr = e.detail.value;
			let i = 0;
			if (this.mode == 'time') {
				// 这里使用i++，是因为this.valueArr数组的长度是不确定长度的，它根据this.params的值来配置长度
				// 进入if规则，i会加1，保证了能获取准确的值
				if (this.params.year) this.year = this.years[this.valueArr[i++]];
				if (this.params.month) this.month = this.months[this.valueArr[i++]];
				if (this.params.day) this.day = this.days[this.valueArr[i++]];
				if (this.params.hour) this.hour = this.hours[this.valueArr[i++]];
				if (this.params.minute) this.minute = this.minutes[this.valueArr[i++]];
			} 
		},
		// 用户点击确定按钮
		getResult(event = null) {
			let result = {};
			// 只返回用户在this.params中配置了为true的字段
			if (this.mode == 'time') {
				if (this.params.year) result.year = this.formatNumber(this.year || 0);
				if (this.params.month) result.month = this.formatNumber(this.month || 0);
				if (this.params.day) result.day = this.formatNumber(this.day || 0);
				if (this.params.hour) result.hour = this.formatNumber(this.hour || 0);
				if (this.params.minute) result.minute = this.formatNumber(this.minute || 0);
				if (this.params.timestamp) result.timestamp = this.getTimestamp();
			} 
			if (event) this.$emit(event, result);
			this.close();
		},
		// 获取时间戳
		getTimestamp() {
			// yyyy-mm-dd为安卓写法，不支持iOS，需要使用"/"分隔，才能二者兼容
			let time = this.year + '/' + this.month + '/' + this.day + ' ' + this.hour + ':' + this.minute ;
			return new Date(time).getTime() / 1000;
		}
	}
};
</script>

<style lang="scss" scoped>

.u-datetime-picker {
	position: relative;
	z-index: 999;
}

.u-picker-view {
	height: 100%;
	box-sizing: border-box;
}

.u-picker-header {
	width: 100%;
	height: 90rpx;
	padding: 0 40rpx;
	display:flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	font-size: 30rpx;
	background: #fff;
	position: relative;
}

.u-picker-header::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid #eaeef1;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 0;
}

.u-picker__title {
	color: $u-content-color;
}

.u-picker-body {
	width: 100%;
	height: 500rpx;
	overflow: hidden;
	background-color: #fff;
}

.u-column-item {
	display:flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: $u-main-color;
	padding: 0 8rpx;
}

.u-text {
	font-size: 24rpx;
	padding-left: 8rpx;
}

.u-btn-picker {
	padding: 16rpx;
	box-sizing: border-box;
	text-align: center;
	text-decoration: none;
}

.u-opacity {
	opacity: 0.5;
}

.u-btn-picker--primary {
	color: $u-type-primary;
}

.u-btn-picker--tips {
	color: $u-tips-color;
}
</style>
