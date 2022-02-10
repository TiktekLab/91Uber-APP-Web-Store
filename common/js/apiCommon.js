import $api from './api.js';
import $http from './httprequest.js';

//查询公告列表
export const getNoticeList = function(data) {
	return $http.get($api.noticeMessageList, data);
}


//添加CID
export const addCidHash = function() {
	const cid = uni.getStorageSync('cid');
	if(cid) {
		return $http.post($api.addCidHash, {
			cid:cid,
			userName:'91Store'
		});			
	}
}