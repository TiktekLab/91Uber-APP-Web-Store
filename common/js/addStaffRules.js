import vue from 'vue';
console.log(vue.prototype.$base);
const rules = {
	username: [{
		required: true,
		message: '请输入姓名',
		trigger: ['change', 'blur'],
	}],
	age: [{
		required: true,
		type: 'number',
		message: '请输入年龄',
		trigger: ['change', 'blur'],
	}, {
		validator: (rule, value, callback) => {
			if (value < 18 || value > 80) {
				return false
			} else {
				callback();
				return true
			}
		},
		message: '请输入正确的年龄',
		trigger: ['change', 'blur'],
	}],
	height: [{
			required: true,
			type: 'number',
			message: '请输入身高',
			trigger: ['change', 'blur'],
		},
		{
			validator: (rule, value, callback) => {
				if (value < 140 || value > 200) {
					return false
				} else {
					callback();
					return true
				}
			},
			message: '请输入正确的身高',
			trigger: ['change', 'blur'],
		}
	],
	weight: [{
			required: true,
			type: 'number',
			message: '请输入体重',
			trigger: ['change', 'blur'],
		},
		{
			validator: (rule, value, callback) => {
				if (value < 30 || value > 100) {
					return false
				} else {
					callback();
					return true
				}
			},
			message: '请输入正确的体重',
			trigger: ['change', 'blur'],
		}
	],
	remark: [{
			required: true,
			message: '请输入自我介绍',
			trigger: ['change', 'blur'],
		},
		{
			min: 100,
			message: '自我介绍长度不够',
			trigger: ['change', 'blur'],
		}
	],
	houseNumber: [{
		required: true,
		message: '请输入精确地址',
		trigger: ['change', 'blur'],
	}, ],
	street: [{
		required: true,
		message: '请输入模糊地址',
		trigger: ['change', 'blur'],
	}, ],

}
module.exports = rules
