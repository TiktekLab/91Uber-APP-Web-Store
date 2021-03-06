// zh.js
export default {
	// 可以以页面为单位来写，比如首页的内容，写在index字段，个人中心写在center，公共部分写在common部分
	lang: {
		title: 'uView UI',
		intro: '多平台快速开发的UI框架',
	},
	index: { // 启动页
		login: '已有账户？点击登录',
		reg: '注册'
	},
	tabBar: { // tabbar
		heart: '广场',
		news: '消息中心',
		user: '个人中心'
	},
	login: { // 登录 or 注册
		savePwd: '记住密码',
		login: '登录',
		loginName: '电话',
		loginPwd: '密码',
		reg: '注册',
		regName: '姓名',
		regNumber: '电话',
		regVerCode: '验证码',
		regSend: '发送验证码',
		regPwd: '密码',
		regRePwd: '再次确认密码',
		regNext: '下一步',
		regInfo: '点击注册按钮即表示您已同意我们的 《91UBER 隐私政策》',
		loginInfo: '输入手机号密码，点击登录按钮即表示您已同意我们的 《91UBER 隐私政策》',
		forGetPwd: '忘记密码？',
		name: '请输入姓名',
		nameLength: '姓名长度2-20位',
		phone: '请输入电话号码',
		code: '请输入验证码',
		codeLength: '验证码为6位数字',
		PleasePwd: '请输入密码',
		password: '密码须包含8-16位字母或数字',
		confirmPwd: '请输入确认密码',
		registerData: '输入密码不一致',
		confirmPhone: '请输入正确电话号码',
		seedCode: '验证码已发送',
		Recapture: '后重新获取',
		resPwd: '密码已重置',
		avatarUploadFailed: '头像上传失败，请重新上传',
		regSuccess: '注册成功',
	},
	uploadAvatar: { // 选择头像
		avatar: '头像',
		info: '请选择一张照片作为您的头像',
		btnText: '选择头像',
		regDown: '注册完成',
	},
	forgetPwd: { // 重置密码
		regName: '忘记密码',
		regPhone: '手机号码',
		regVerCode: '验证码',
		regSend: '发送验证码',
		newPwd: '新密码',
		confirmPwd: '再次输入新密码',
		btnText: '重置密码'
	},
	heart: { // 广场
		switchSJ: '切换商家端榜单',
		switchKH: '切换客户端榜单',
		goodTextSJ: '优质员工榜',
		goodTextKH: '优质富豪榜',
		BadTextSJ: '远离照骗榜',
		BadTextKH: '远离渣男榜',
		TBA: '待上榜',
	},
	setUp: { // 个人中心 - 设置
		setting: '设置',
		switchLang: '切换语言',
		signOut: '退出登录',
		title: '提示',
		content: '确认退出登录吗？',
		cancel: '取消',
		confirm: '确认',
	},
	user: { // 个人中心
		title: '个人中心',
		staffList: '员工列表',
		working: '工作中',
		Available: '空闲中',
		Disabled: '已下线',
		nextTime: '下次预约时间',
		Reserved: '已预约',
		edti: '编辑',
		Offline: '下线',
		Online: '上线',
		del: '删除',
		loadmore: '轻轻上拉',
		loading: '努力加载中',
		nomore: '没有更多数据',
		addStaff: '新增员工',
	},
	addStaff: { // 新增员工
		title: '新增员工',
		addAvatar: '点击添加头像',
		staffName: '员工姓名',
		age: '年龄',
		gender: '性别',
		height: '身高',
		weight: '体重',
		addressOne: '模糊地址（具体到街号）',
		addressTwo: '精确地址（门牌号）',
		hourlyRate: '堂食价格(按小时)',
		outcallRate: 'Outcall价格(按小时)',
		Introduction: '自我介绍',
		NextStep: '下一步',
		addPicture: '添加照片（至少添加一张）',
		addPhoto: '添加图片',
		addVideo: '添加视频',
		bodyType: '身材类型',
		bustSize: '胸围',
		serviceType: '服务类型',
		Tag: '标签',
		Complete: '完成',
		confirmText: '确认',
		cancelText: '取消',
	},
	staffDetails: { // 员工详情
		title: '员工详情',
		Review: '评分',
		id: '编号',
		Total: '总工时',
		Hour: '小时',
		staffState: '当前工作状态',
		Order: '订单',
		Offline: '下线',
		Online: '上线',
		addTime: '添加时间',
		BookingState: '预约状态',
		available: '空闲中',
		working: '工作中',
		Available: '空闲中',
		Disabled: '已下线',
		Reserved: '已预约',
		booked: '已预约',
		addPicture: '添加照片（至少添加一张）',
		addPhoto: '添加图片',
		addVideo: '添加视频',
		Introduction: '自我介绍',
		staffName: '员工姓名',
		age: '年龄',
		gender: '性别',
		height: '身高',
		weight: '体重',
		addressOne: '模糊地址（具体到街号）',
		addressTwo: '精确地址（门牌号）',
		hourlyRate: '堂食价格(按小时)',
		outcallRate: 'Outcall价格(按小时)',
		bodyType: '身材类型',
		bustSize: '胸围',
		serviceType: '服务类型',
		Tag: '标签',
		confirmText: '确认',
		cancelText: '取消',
		Ongoing: '进行中',
		HistoryOrder: '历史订单',
		year: '年',
		month: '月',
		backtoday: '回到今天',
		su: '日',
		mo: '一',
		tu: '二',
		we: '三',
		th: '四',
		fr: '五',
		sa: '六',
		today: '今天',
		editTime: '编辑时间',
		StartTime: '开始时间',
		EndTime: '结束时间',
		confirmDel: '确认删除！',
		del: '删除',
		Schedule: '排班表',
		TimeScheduled: '接单表',
		Profile: '个人信息',
		warnTTimeSlot: '更改时间段已有预约，不可更改',
		TipsStartTime: '开始时间须大于当前时间',
		TipsEndTimeCurrent: '结束时间须大于当前时间',
		TipsEndTime: '结束时间须大于开始时间',
		TipsAddTime: '不能添加跨天时间',
		TipsAddSuccess: '新增成功',
		TipsEditSuccess: '修改成功',
		TipsDel: '已删除',
	},
	heartDetails: { // 广场 - 用户详情
		Ratings: '评分',
		evaluate: '收到的评价',
		id: '编号',
	},
	news: { // 消息中心
		Remind: '提醒',
		Request: '请求',
		SystemNotice: '公告',
		Disagree: '拒绝',
		Agree: '同意',
		orderDetails: '订单详情',
		FullAddress: '完整地址',
		orderCompelete: '订单结束',
		Cancel: '取消订单',
		startServe: '订单开始',
		confirm: '确认',
		NoticeDetails: '详情',
		OrderRejected: '已拒绝接单',
		OrderReceived: '接单成功',

	},
	showToast: { // 弹框提示
		loginRes: '登录成功',
		exitRes: '退出成功',
		switchLangRes: '切换成功',
		dropDown: '下拉刷新',
		update: '释放更新',
		empty: '空空如也',
		Loading: '加载中',
		Notice: '系统公告',
		NOffline: '不能下线，该员工目前有预约',
		Online: '已上线',
		Offline: '已下线',
		ConfirmOffline: '确认下线？',
		Cancel: '取消',
		Confirm: '确认',
		NVideo: '视频上传失败，请重新上传',
		NPhoto: '照片上传失败，请重新上传',
		save: '保存成功',
		selectLable: '请选择标签',
		selectService: '请选择服务类型',
		selectBust: '请选择胸围',
		selectFigure: '请选择身材类型',
		Outcall: 'Outcall价格须大于0',
		ChargeMark: '堂食价格须大于0',
		houseNumber: '请输入员工精确地址',
		street: '请输入员工模糊地址',
		weight: '请输入员工体重',
		height: '请输入员工身高',
		gender: '请选择员工性别',
		selectAge: '员工年龄须介于18-80岁之间',
		age: '请输入员工年龄',
		avatar: '请上传员工头像',
		remarkLength: '员工自我介绍不能超过500个字符',
		staffName: '请输入员工姓名',
		remark: '请输入员工自我介绍',
		imageLength: '请至少添加一张照片',
		modalContent: '员工删除后不可恢复，请谨慎操作',
		Notice: '提示',
		SetLang: '设置语言需要重启应用才能生效',
		Notices: '温馨提示',
		toLoginInfo: '此时此刻需要您登录哦~',
		toLogin: '去登录',
	},
	orderList: { // 订单列表
		OrderPlaced: '已下单',
		OrderReceived: '店铺已接单',
		ConfirmArrival: '确认到达',
		SendDetailedAddress: '已发送详细地址',
		StartUp: '开始工作',
		Completed: '已完成',
		unfinish: '未完成',
		OrderCancel: '订单取消',
		Scored: '已评分：',
		NoScore: '未评分',
		confirmDel: '确认删除？',
		confirmDelContent: '订单删除后不可恢复，请谨慎操作',
		confirm: '确认',
		cancel: '取消',
		del: '删除',
		Deleted: '已删除',
		CancelOrder: '取消定单',
		FuzzyAddress: '等待对方到达模糊地址',
		SendFullAddress: '对方已到达模糊地址，发完整地址',
		OrderStart: '订单开始',
		OrderEnd: '订单结束',
		Fuzzy: '模糊地址：',
		Full: '完整地址：',
		OrderCancelled: '订单已取消',
		SentSuccess: '发送成功',
		StartSuccess: '订单开始成功',
		endSuccess: '订单结束成功',
		score: '评分：',
		branch: '分',
		evaluate: '给出您的评价！',
		close: '关闭',
		Submit: '提交',
		PleaseScore: '请选择评分',
		PleaseTag: '请至少选择一个评价标签',
		scoreSuccess: '评价成功',
		ContactInfo: '联系方式',
		ContactPhone: '联系电话',
		ContactAddress: '详细地址',
	}
}
