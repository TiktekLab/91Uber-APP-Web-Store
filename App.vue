<script>
import push from "@/common/js/push.js";
import { mapState, mapMutations } from "vuex";
import { launchCall, loginCall, login, refreshToken } from "@/common/js/common.js";
import { webSocketConnect, WebSocketClose } from "@/common/js/webSocketPush.js";

export default {
	onLaunch: function() {
		//监听推送
		push(this);
		setTimeout(() => {
			plus.navigator.closeSplashscreen();
		}, 2000);
		uni.hideTabBar();
		//launchCall();
		this.updateApp();
		//this.autoLogin();	
		const res = uni.getSystemInfoSync();
		let appLink = 'https://img.91uber.co/126/1508686120200306783.apk';
		if(res.platform === 'ios'){
			appLink = 'https://testflight.apple.com/join/RHV6E4SC';
		}
		uni.showModal({
			title: '温馨提示',
			content: '有新版本可以更新，赶快体验最新版本吧！',
			showCancel: false,
			confirmText: '立即升级',
			confirmColor: '#992F65',
			success: function (res) {
				if (res.confirm) {
					plus.runtime.openURL(appLink);
				} 
			}
		});
	},
	data() {
		return {
			hideFlag: false			
		};
	},
	computed:{
		...mapState(["messageClick"]),
	},
	methods: {
		...mapMutations(["setUserInfo"]),
		  autoLogin() {
			const logout = uni.getStorageSync("logout");
			if(logout) return;			
			login().then(res=> {
				loginCall();
				refreshToken();
				uni.removeStorageSync("logout");				
				if(!this.messageClick) {
					uni.switchTab({
						url: "../heart/heart"
					});							
				}
			})
		},
		updateApp() {
			// #ifdef APP-PLUS
			const that = this;
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				that.$http.get(that.$api.getVersion, { type: 0, codeMin: widgetInfo.versionCode }, {
					header: {
						Authorization: that.$base.authorization,
						number: that.$base.authNumber
					},
					tokenRequired: false
				}).then(res => {
					//console.log("Version:", res);
					const versionInfo = res.edition;
					if(versionInfo.isForcedUpdate) {							
						uni.downloadFile({
							url: plus.os.name === "Android" ? versionInfo.androidUrl : versionInfo.iosUrl,  
							success: (downloadResult) => {  
								if (downloadResult.statusCode === 200) {  
									plus.runtime.install(downloadResult.tempFilePath, {  
										force: false  
									}, function() {  
										uni.showModal({
											title: versionInfo.title || "更新提示",
											content: versionInfo.description || "已为您准备好新版本，是否重启App安装更新？",
											success(res) {
												if (res.confirm) {
													plus.runtime.restart();
												}
											}
										})			                
									}, function(e) {  
										console.error('install fail...');  
									});  
								}  
							}  
						});
					}
				})
			})
			// #endif				
		}
	},
	onShow() {
		if(this.hideFlag){
			webSocketConnect();
			loginCall();
		}
	},
	onHide() {
		this.hideFlag = true;
		WebSocketClose();
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
@import url("./common/css/common.scss");
@import url("./common/css/global.scss");
@import url("./components/gaoyia-parse/parse.css");
</style>
