const api = {
	login: '/oauth/token', //登录
	addCidHash: '/api-tools/fcm/addCidHash', //添加推送CID信息，userName：91Store  91Member
	sendCode: '/api-dancers/store/sendCode', //发送验证码
	register: '/api-dancers/store/register', //店铺注册 
	loginOut: '/api-uaa/oauth/remove/token', //退出登录
	imgUpload: '/api-file/oss/imgUpload', //图片文件上传
	imgUploads: '/api-file/oss/imgUploads', //多图片文件上传
	videoUpload: '/api-file/oss/videoUpload', //视频文件上传
	updateStoreInfo: '/api-labour/store/store', //修改店铺信息
	storeStaffList: '/api-labour/employees/store', //店铺员工列表
	figuresList: '/api-dancers/open/figures', //身材列表
	bustList: '/api-labour/busts', //胸围列表
	classificationList: '/api-labour/classifications', //分类列表
	labelList: '/api-labour/labels', //标签列表
	serviceTypeList: '/api-labour/serves', //服务类型列表
	createStaff: '/api-dancers/employee', //新增员工
	staffDetails: '/api-labour/employee/', //员工详情
	updateStaffInfo: '/api-dancers/employee/', //修改员工信息
	staffUp: (employeeId) => `/api-dancers/employee/${employeeId}/up`, //员工上线
	staffDown: (employeeId) => `/api-dancers/employee/${employeeId}/down`, //员工下线
	deleteStaff: '/api-dancers/employee/', //删除员工
	staffWorkHours: '/api-dancers/workHours', //员工工作时间查询
	addStaffWorkTime: '/api-dancers/workHours', //添加员工工作时间
	addStaffPersonalTime: '/api-labour/workHourPersonal', //添加员工个人时间
	updateStaffWorkTime: '/api-dancers/workHour/', //修改员工工作时间
	deleteStaffWorkTime: '/api-labour/workHour/', //删除员工工作时间
	staffWorkTimeList: '/api-labour/workHours/date', // 工作时间是否设置（按日期查询）（店铺）
	labourOrders: '/api-order/labourOrders/date', // 订单是否有
	orderList: '/api-dancers/order/labourOrders', //查询订单列表
	memberList: '/api-member/member/members', //客户列表
	staffList: '/api-labour/employees', //员工列表
	memberInfo: '/api-member/member/infoSimpleVO', //客户用户详情
	evaluationStatistics: '/api-post/evaluation/label/statistics/', //评价标签统计	
	deleteOrder: '/api-order/labourOrder/', //删除订单
	sendRestCode: '/api-dancers/open/store/sendCode/resetPwd', // 店铺发送重置密码验证码
	resetPwd: '/api-dancers/open/store/resetPwd', // 店铺重置密码
	remindsList: '/api-dancers/post/reminds', //对应消息中心迟到请求
	noticeMessageList: '/api-post/message/messages', //公告列表
	notificationList: '/api-dancers/post/notifications', //通知列表（对应消息订单请求）
	agreeOrder: (orderId) => `/api-dancers/order/${orderId}/agree`, //店铺接单
	disagreeOrder: (orderId) => `/api-dancers/order/${orderId}/refuse`, //店铺拒绝接单
	orderDetails: '/api-dancers/order/labourOrder/', //订单详情
	orderDetailsByWorkTimeId: (workTimeId) => `/api-dancers/order/labourOrder/workTimeId/${workTimeId}`, //订单详情
	orderCancel: (orderId) => `/api-dancers/order/${orderId}/cancel`, //店铺订单取消
	sendFullAddress: (orderId) => `/api-dancers/order/${orderId}/sendAddress`, //店铺发送详细地址
	orderBegin: (orderId) => `/api-dancers/order/${orderId}/begin`, //开始工作
	orderStart: (orderId) => `/api-order/labourOrder/${orderId}/begin`, //开始工作(新)
	orderComplete: (orderId) => `/api-dancers/order/${orderId}/end`, //订单结束
	evaluationLabelsList: '/api-post/evaluationLabels', //评价标签列表0: 客户 1: 员工
	orderEvaluationList: (orderId, type) => `/api-post/evaluation/label/${orderId}/${type}`, //订单评价列表,Type,1对客户的评价,2.对员工的评价	
	orderScoreByStaff: '/api-dancers/order/evaluation/member', //店铺评价客户
	evaluationList: (merchandiseId) => `/api-post/evaluation/evaluations/${merchandiseId}`, //被评价列表
	addCidHash: '/api-tools/fcm/addCidHash', //添加推送CID信息，0：商户端  1: 客户端
	adjustOrderPutOff: (orderId, isAgree) => `/api-dancers/order/${orderId}/putOff/isAgree/${isAgree}`, // 商户端处理推迟订单请求
	employeeSimple: (employeeId) => `/api-labour/employee/${employeeId}/simple/member`, // 员工简略信息
	storeInfo: '/api-labour/store/info', // 员工简略信息
	orderFinishedCount: '/api-order/labourOrders/finished/count', //
	notFinished: '/api-order/labourOrders/notFinished/count',
	storeFollowCount: '/api-post/employeeFollow/count/storeId', // 关注店铺人数
	platformContactList: '/api-cms/platformContacts', //联系我们
	getRemindUnreadCount: '/api-post/remind/unread/count', //提醒未读数
	getNotificationUnreadCount: '/api-post/notification/notification/unread/count', //通知未读数
	remindRead: (remindId) => `/api-post/remind/${remindId}/read`, //提醒已读
	notificationRead: (notificationId) => `/api-post/notification/${notificationId}/read`, //提醒已读	
	batchRemindRead: "/api-post/remind/readList", //提醒批量已读
	batchNotificationRead: "/api-post/notification/readList", //通知批量已读
	deleteNotification: (notificationId) => `/api-post/notification/notification/${notificationId}`, //通知删除
	deleteRemind: (remindId) => `/api-post/remind/${remindId}`, //提醒删除
	getAmounts: '/api-cms/rechargeAmounts', // 充值定金配置
	paymentDeposit: '/api-dancers/pay/store/bond/stripePayment', // 充值定金配置
	bondRefund: '/api-labour/storeWithdraw/store', // 商家提现
	getBondOutCall: '/api-dancers/config/bondOutCall', // 外卖定金查询
	getBond: '/api-dancers/config/bond', // 堂食定金查询
	deleteWorkTime: (workHourPersonalId) => `/api-labour/workHourPersonal/${workHourPersonalId}`,  //私人时间删除	
	getVersion: "/api-dancers/open/edition/new", //查询版本
}
export default api
