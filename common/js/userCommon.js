import $store from '@/store';
import Vue from 'vue'
import zh from '@/common/locales/zh.js';
import en from '@/common/locales/en.js';
import VueI18n from 'vue-i18n'; 
Vue.use(VueI18n)

const language = uni.getStorageSync('language')
const i18n = new VueI18n({
	locale: language || 'zh',
	messages: {
		'zh': zh, // 这里为上面通过import引入的语言包
		'en': en,
	}
})

import { updateNotificationUnreadCount, updateRemindUnreadCount } from "./storeCommon.js";
import { updateLocalNotice } from "./localDatabse.js";

//消息页面路由
const messagePageRoute = "pages/news/news";

//获取登录Token
export function getToken() {
	const token = $store.state.userInfo.access_token;
	if (token) return token;
	const userInfo = uni.getStorageSync("userInfo");
	return userInfo?.access_token;
}

//登录Token过期，无权限提示登录
let popFlag = true;
export function loginPrompt() {
	if (popFlag) {
		popFlag = false;
		uni.showModal({
			title: i18n.t('showToast.Notices'),
			content: i18n.t('showToast.toLoginInfo'),
			confirmText: i18n.t('showToast.toLogin'),
			showCancel: false,
			success: function(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: "/pages/index/index"
					})
					popFlag = true;
				}
			}
		})
	}
}

//根据消息类型更新本地数据
const updateInfoByMsgType = (mesageType) => {
	if([1, 2, 3, 4, 12, 14, 15, 1002].includes(mesageType)){
		uni.$emit("autoUpdateByPushMsg");
	}
}

//刷新消息页面数据
export const updateNewsData = (noticeType, mesageType) => {
	if (noticeType === 100) {
		if (mesageType === 1001) {
			//更新本地公告数据		
			uni.$emit("updateMessage", {
				reset: false,
				noticeType: 4
			});
		} else if (mesageType === 1002) {
			//更新订单请求
			updateNotificationUnreadCount().then(res => {
				uni.$emit("updateMessage", {
					reset: false,
					noticeType: 2
				});
			})
			updateInfoByMsgType(mesageType);
		}		
	} else {			
		if (noticeType === 4) {
			//更新本地公告数据
			updateLocalNotice().then(res => {
				uni.$emit("updateMessage", {
					reset: false,
					noticeType
				});
			});
		} else if (noticeType === 2) {
			//更新订单请求
			updateNotificationUnreadCount().then(res => {
				uni.$emit("updateMessage", {
					reset: false,
					noticeType
				});
			})
			updateInfoByMsgType(mesageType);
		} 
	}
}

//消息弹框
//noticeType，1：remind  2:Notification 3:员工消息（关注的员工） 4：公告，100：登录查询离线消息数量
//mesageType，服务端发送消息具体类型，其它：1001：本地公告，1002：订单提醒
export const messagePrompt = (num, noticeType, mesageType) => {
	if (num > 0) {
		updateNewsData(noticeType, mesageType);			
		const currentMessagePage = getMessagePage();
		uni.showModal({
			title: `您有${num}条新消息`,
			content: '可以在消息页面进行查看',
			confirmText: currentMessagePage ? "查看消息" : "前往消息",
			success: function(res) {
				if (res.confirm) {
					uni.switchTab({
						url: "/" + messagePageRoute
					});
				}
			}
		})
	}
}

//消息中心页面，当前是否在消息中心页面
export const getMessagePage = () => {
	const routes = getCurrentPages();
	if(routes && routes.length) {
		const page = routes[routes.length - 1].route;
		return page === messagePageRoute;		
	}
	return false;
}
