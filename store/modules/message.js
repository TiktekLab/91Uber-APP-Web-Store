import $http from '../../common/js/httprequest.js';
import $api from '../../common/js/api.js';
import { getNoticeUnReadCount } from "@/common/js/localDatabse.js";
export const state = {
	notificationUnreadCount: 0, //通知未读数量（订单提醒）
	remindUnreadCount: 0, //提醒未读数量（关注提醒）
	noticeUnreadCount: 0, //系统公告未读数量
};
export const getters = {
	//总计未读数量
	totalUnreadCount: state => {
		return state.notificationUnreadCount + state.remindUnreadCount + state.noticeUnreadCount;
	}
};
export const mutations = {
	setNotificationUnreadCount(state, value) {
		state.notificationUnreadCount = value;
		// #ifdef APP-PLUS
		const badgeNum = state.notificationUnreadCount + state.remindUnreadCount + state.noticeUnreadCount;
		plus.runtime.setBadgeNumber(badgeNum);
		// #endif
	},
	setRemindUnreadCount(state, value) {
		state.remindUnreadCount = value;
		// #ifdef APP-PLUS
		const badgeNum = state.notificationUnreadCount + state.remindUnreadCount + state.noticeUnreadCount;
		plus.runtime.setBadgeNumber(badgeNum);
		// #endif
	},
	setNoticeUnreadCount(state, value) {
		state.noticeUnreadCount = value;
		// #ifdef APP-PLUS
		const badgeNum = state.notificationUnreadCount + state.remindUnreadCount + state.noticeUnreadCount;
		plus.runtime.setBadgeNumber(badgeNum);
		// #endif
	}
};
export const actions = {
	asyncSetNotificationUnreadCount({
		commit
	}) {
		return $http.get($api.getNotificationUnreadCount).then(res => {
			commit('setNotificationUnreadCount', res.count);
		})
	},
	asyncSetRemindUnreadCount({
		commit
	}) {
		return $http.get($api.getRemindUnreadCount).then(res => {
			commit('setRemindUnreadCount', res.count);
		})
	},
	asyncSetNoticeUnreadCount({
		commit
	}) {
		return getNoticeUnReadCount().then(res => {
			commit('setNoticeUnreadCount', res);
		})
	},
};
