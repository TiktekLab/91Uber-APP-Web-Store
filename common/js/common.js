import $api from './api.js';
import $http from './httprequest.js';
import $base from './baseconfig.js';
import { updateStoreInfo, updateNotificationUnreadCount, updateRemindUnreadCount, setCacheData, setLoginUserInfo } from "./storeCommon.js";
import { webSocketConnect, WebSocketLogin } from "./webSocketPush.js";
import { initNoticeDB, updateLocalNotice } from "./localDatabse.js";
import { getToken, messagePrompt } from "./userCommon.js";
import { addCidHash } from "./apiCommon.js";

//防止多次点击处理
//method是点击后需要执行的函数 
//parameters是点击需要传的参数
export function noMultipleClicks(method, parameters) {
	let that = this;
	if (that.noClick) {
		// 第一次点击
		that.noClick = false;
		method(parameters);
		setTimeout(() => {
			that.noClick = true;
		}, 2000)
	} else {
		// 这里是重复点击的判断
	}
}

//App运行时
export function launchCall() {
	//取出缓存数据
	//setCacheData();
	//notice本地数据
	initNoticeDB();
	//监听推送
	webSocketConnect();
}

//登录后操作方法
export function loginCall() {
	const token = getToken();
	if(token) {
		// 商户信息
		updateStoreInfo().then(res => {
			//更新本地公告		
			updateLocalNotice().then(count => {
				messagePrompt(count, 100, 1001);			
			});
		});
		updateNotificationUnreadCount(); // 未读通知
		updateRemindUnreadCount(); //未读提醒
		WebSocketLogin();	
		setTimeout(()=> {
			addCidHash();	
		}, 10000);
	}
}

//登录
export const login = function() {
	return new Promise((resolve, reject)=> {
		const userData = uni.getStorageSync("saveLoginStore");	
		if(userData){
			const loginData =  Object.assign({}, userData);
			loginData.username = '0'+ loginData.username;
			$http.post($api.login + `?grant_type=${$base.grantType}`, loginData, {
				header: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: $base.authorization
				},
				tokenRequired: false
			}).then(res => {
				setLoginUserInfo(res);
				resolve(res);
			}).catch(err => {
				reject(err);
			});
		} else {
			uni.removeStorageSync("saveLoginStore");
			reject("未记住密码");			
		}
	})
}

//刷新登录Token
export const refreshToken = function() {
	const timeOut = setTimeout(()=> {
		updateStoreInfo().then(res => {
			clearTimeout(timeOut);
			refreshToken();			
		}).catch(err => {
			login().then(res=> {				
				clearTimeout(timeOut);
				refreshToken();
			}).catch(err=> {
				clearTimeout(timeOut);				
			})		
		})	
	}, $base.tokenRefreshTime);
}

//打开链接
export const openLink = (link) => {	
	if(link){
		const url = link.toLowerCase();
		if(url.startsWith('https://') || url.startsWith('http://')){
			let toLink;
			if(url.endsWith('.pdf')){
				toLink = `/hybrid/html/web/viewer.html?file=${encodeURIComponent(link)}`;
			} else {
				toLink = encodeURIComponent(link);
			}						
			uni.navigateTo({
				url:`/pages/link/link?openLink=${toLink}`							
			})
		}
	}
}