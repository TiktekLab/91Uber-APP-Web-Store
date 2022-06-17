<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>
<script>
	let wvAddress;
	export default {
		data() {
			return {
				src: ""
			}
		},
		onLoad(option) {
			let viewUrl = "/hybrid/html/staffaddress.html?option=" + option.option + "&googleKey=" + option.googleKey
			if (option.address) {
				viewUrl += "&address=" + option.address
			}
			this.src = viewUrl
			// wvAddress = plus.webview.create("", "staff-address", {
			// 	'uni-app': 'none',
			// 	top: uni.getSystemInfoSync().statusBarHeight + 44
			// })
			// wvAddress.loadURL(viewUrl);
			// const currentWebview = this.$scope.$getAppWebview();
			// currentWebview.append(wvAddress);
		},
		onBackPress(e) {
			if (wvAddress) {
				wvAddress.clear()
				wvAddress.close()
			}
		},
		methods: {

		}
	}
</script>
<style lang="scss">
</style>
