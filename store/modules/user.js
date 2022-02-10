import $http from '../../common/js/httprequest.js';
import $api from '../../common/js/api.js'
export const state = {
	//用户数据
	userInfo: {}, // 用户信息
	storeInfo: {}, // 店铺信息
	staffCount: 0, //总员工数据量
};
export const getters = {
	//当前登录用户ID
	loginUserId: state => {
		return state.storeInfo?.id;
	}
};
export const mutations = {
	//储存用户信息
	setUserInfo(state, data) {
		if (data) {
			state.userInfo = Object.assign({}, state.userInfo, data);
			uni.setStorageSync('userInfo', state.userInfo);
		}
	},
	// 退出APP
	emptyUserInfo(state) {
		state.userInfo = {};
		uni.removeStorageSync("userInfo");
	},
	setStoreInfo(state, value) {
		state.storeInfo = value;
	},
	//保存员工数量
	setStaffCount(state, value) {
		state.staffCount = value;
	},
};
export const actions = {
	asyncSetStoreInfo({
		commit
	}) { // 店铺信息
		return $http.get($api.storeInfo).then(res => {
			commit('setStoreInfo', res.store)
		});
	}
};
