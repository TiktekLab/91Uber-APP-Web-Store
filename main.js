import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import { noMultipleClicks } from '@/common/js/common.js';
import filters from "@/plugins/filters.js";

Vue.mixin({
	data() {
		return {
			isAndroid: false,
		}
	},
	mounted() {
		const res = uni.getSystemInfoSync();
		if (res.platform === 'android') {
			return this.isAndroid = true;
		}
		return this.isAndroid = false;
	},
	computed: {
		avatarUrl() {
			return userId => {
				return require(`@/static/image/avatar${(userId || 6) % 6}.png`);
			};
		},
		formatPrice() {
			return (price) => {
				if (!price) return '$0.00';
				const data = Number(price).toFixed(2)
				return `$${data}`
			}
		},
		formatPhone() {
			return (phone) => {
				if (!phone) return '';
				return '+61 ' + phone.substr(1);
			}
		},
	}
})
// 国际化配置
import zh from '@/common/locales/zh.js';
import en from '@/common/locales/en.js';
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
// uni.clearStorageSync();  // 清楚本地缓存
var language = undefined;
if (uni.getStorageSync('language')) {
	language = uni.getStorageSync('language')
} else {
	language = (uni.getSystemInfoSync().language.indexOf('en') === 0) ? 'en' : 'zh'
	uni.setStorageSync('language', language);
}
uni.$emit("setMescrollGlobalOption", {
	i18n: {
		type: language
	}
})

// 构造i18n对象
const i18n = new VueI18n({
	// 默认语言，这里的local属性，对应message中的zh、en属性
	locale: language || 'zh',
	// 引入语言文件
	messages: {
		// 这里的属性名是任意的，您也可以把zh设置为cn等，只是后续切换语言时
		// 要标识这里的语言属性，如：this.$i18n.locale = zh|en|zh|xxx
		'zh': zh, // 这里为上面通过import引入的语言包
		'en': en,
	}
})
Vue.prototype._i18n = i18n
//数据管理中心
import store from '@/store'
Vue.prototype.$store = store;
//通用配置
import $base from '@/common/js/baseconfig.js'
Vue.prototype.$base = $base;
//挂载全局API
import $api from '@/common/js/api.js'
Vue.prototype.$api = $api;
//挂载全局http请求
import $http from '@/common/js/httprequest.js'
Vue.prototype.$http = $http;
//防止多次点击
Vue.prototype.$noMultipleClicks = noMultipleClicks;
//添加全局filter
Object.keys(filters).map(v => {
	Vue.filter(v, filters[v]);
})

Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView);
const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
