import $store from '@/store';

//登录用户ID
export const getLoginUserId = () => {
	return $store.getters.loginUserId;
}

//更新商户信息return Promise
export const updateStoreInfo = () => {
	return $store.dispatch('asyncSetStoreInfo'); // 获取店铺信息
}

//更新未读通知数量return Promise
export const updateNotificationUnreadCount = () => {
	return $store.dispatch("asyncSetNotificationUnreadCount");
}

//更新未读提醒数量return Promise
export const updateRemindUnreadCount = () => {
	return $store.dispatch("asyncSetRemindUnreadCount");
}

//更新公告未读数量return Promise
export const updateNoticeUnreadCount = () => {
	return $store.dispatch("asyncSetNoticeUnreadCount");
}

//取除缓存数据
export const setCacheData = () => {
	$store.commit("setCacheData");
}

//存储登录信息
export const setLoginUserInfo = (value) => {
	$store.commit("setUserInfo", value);
}

//清除登录信息
export const removeLoginUserInfo = () => {
	$store.commit("emptyUserInfo");
}