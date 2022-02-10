<template>
	<view class="videoBox">
		<video class="userVideo" :autoplay="true" :style="'height:' + pageHeight + 'px'" :src="videoUrl"></video>
	</view>
</template>

<script>
export default {
	onLoad(option) {
		const baseUrl = decodeURIComponent(option.data)
		this.videoUrl = JSON.parse(baseUrl);
		const data = uni.getSystemInfoSync();
		this.pageHeight = data.windowHeight;
		console.log(data);
	},
	data() {
		return {
			pageHeight: null,
			videoUrl: null
		}
	}
};
</script>

<style lang="scss">
.videoBox{
	display: flex;
	.userVideo {
		width: 750rpx;
		margin: 0;
		padding: 0;
	}
}

</style>
