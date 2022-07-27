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
			// 'Content-Type': 'multipart/form-data',
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
function urlToBase64(url) {
	return new Promise ((resolve,reject) => {
		let image = new Image();
		image.onload = function() {
			let canvas = document.createElement('canvas');
			canvas.width = this.naturalWidth;
			canvas.height = this.naturalHeight;
			// 将图片插入画布并开始绘制
			canvas.getContext('2d').drawImage(image, 0, 0);
			// result
			let result = canvas.toDataURL('image/png')
			resolve(result);
		};
		// CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
		image.setAttribute("crossOrigin",'Anonymous');
		image.src = url;
		// 图片加载失败的错误处理
		image.onerror = () => {
			reject(new Error('urlToBase64 error'));
		};
	}
	)
}

function base64ToBlob(base64Data) {
	let arr = base64Data.split(','),
		fileType = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		l = bstr.length,
		u8Arr = new Uint8Array(l);

	while (l--) {
		u8Arr[l] = bstr.charCodeAt(l);
	}
	return new Blob([u8Arr], {
		type: fileType
	});
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
				// 'content-type': 'multipart/form-data',
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
