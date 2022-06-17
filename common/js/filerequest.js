import base from './baseconfig.js';
import { loginPrompt, getToken } from './userCommon.js';

/**
 * 上传文件到服务器
 * url:服务器 url
 * filePath:要上传文件资源的路径(本地路径)
 * name:文件对应的 key , 在服务器端通过这个 key 可以获取到文件二进制内容
 * formData:HTTP 请求中其他额外的 form data
 * loading:是否显示loading
 * success:function,上传成功的回调函数
 * fail:function,上传失败的回调函数
 */
export function uploadFile(options = {}) {
	if (options.loading) {
		uni.showLoading({
			mask: true
		})
	}
	uni.uploadFile({
		url: base.baseUrl + options.url,
		filePath: options.filePath,
		file: options.file,
		name: options.name,
		header: {
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + getToken()
		},
		formData: options.formData,
		success: (res) => {
			console.log('success:', res);
			let responseData = res.data
			if (typeof(res.data) === "string") {
				responseData = JSON.parse(res.data)
			}
			if (responseData.code === '1000') {
				if (options.success) {
					options.success(responseData.data)
				}
			} else {
				if (options.fail) {
					options.fail(res)
				}
			}
		},
		fail: (err) => {
			console.log('fail:', err);
			if (err.statusCode === 401) {
				loginPrompt()
			} else {
				if (options.fail) {
					options.fail(err)
				}
			}
		},
		complete() {
			if (options.loading) {
				uni.hideLoading()
			}
		}
	})
}

// 多文件上传
export function uploadFiles(options = {}) {
	if (options.loading) {
		uni.showLoading({
			mask: true
		})
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: base.baseUrl + options.url,
			files: options.files,
			header: {
				'content-type': 'multipart/form-data',
				'Authorization': 'Bearer ' + getToken()
			},
			formData: options.formData,
			success: (res) => {
				let responseData = res.data
				if (typeof(res.data) === "string") {
					responseData = JSON.parse(res.data)
				}
				if (options.loading) {
					uni.hideLoading()
				}
				if (responseData.code === '1000') {
					resolve(responseData.data);
				} else {
					reject(res);
				}
			},
			fail: (err) => {
				console.log('fail:', err);
				if (options.loading) {
					uni.hideLoading()
				}
				if (err.statusCode === 401) {
					loginPrompt()
				}
				reject(res);
			}
		})
	})
}

/**
 * 下载文件
 * url：下载资源的 url
 * loading:是否显示loading
 * success:function,上传成功的回调函数
 * fail:function,上传失败的回调函数
 * Progress:function,下载进度回调函数
 */
export function downloadFile(options = {}) {
	if (options.loading) {
		uni.showLoading({
			mask: true
		})
	}
	var downloadTask = uni.downloadFile({
		url: base.baseUrl + options.url,
		header: {
			'Authorization': 'Bearer ' + getToken()
		},
		success: (res) => {
			if (res.statusCode === 200) {
				if (options.success) {
					options.success(res)
				}
			} else {
				if (options.fail) {
					options.fail(res)
				}
			}
		},
		fail: (err) => {
			if (err.statusCode === 401) {
				loginPrompt()
			} else {
				if (options.fail) {
					options.fail(err)
				}
			}
		},
		complete: () => {
			if (options.loading) {
				uni.hideLoading()
			}
		}
	});
	if (options.Progress) {
		downloadTask.onProgressUpdate((res) => {
			options.Progress(res.progress)
		});
	}
}
