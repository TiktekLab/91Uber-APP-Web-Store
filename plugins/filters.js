import moment from "moment";
export default {
	//时间格式：ddd MMM DD yyyy HH:mm
	timeDate(time) {
		if (time) return moment(time.replace('T', ' ')).format('ddd MMM DD yyyy HH:mm');
		return null;
	},
	//时间格式：13:10/12 Jun
	timeHmdm(time) {
		if (time) return moment(time.replace('T', ' ')).format('HH:mm/D MMM');
		return null;
	},
	//时间格式：HH:mm
	timeHm(time) {
		if (time) return moment(time.replace('T', ' ')).format('HH:mm');
		return null;
	},
	//订单状态，5.6历史订单，其它进行中订单
	orderStatusTxt(status) {
		switch (status) {
			case 0:
				return "已下单";
			case 1:
				return "已确认";
			case 2:
				return "确认到达";
			case 3:
				return "已发送房号";
			case 4:
				return "开始工作";
			case 5:
				return "已完成";
			case 6:
				return "订单取消";
			default:
				return "";
		}
	},
	outCallStatus(status) {
		switch (status) {
			case 0:
				return "已下单";
			case 1:
				return "已确认";
			case 2:
			case 3:
			case 4:
				return "开始工作";
			case 5:
				return "已完成";
			case 6:
				return "订单取消";
			default:
				return "";
		}
	},
	scoreFormat(score) {
		if(score && score !== "null"){
			const a = '' + score;
			const i = a.indexOf('.');
			if (i === -1) return a + '.00';
			if (i > 0) {
				const prefix = a.substr(0,i);
				const subfix = a.substr(i+1);
				if (subfix.length === 0) return prefix + '.00';
				if (subfix.length === 1) return prefix + '.' + subfix + '0';
				if (subfix.length === 2) return prefix + '.' + subfix;
				if (subfix.length > 2) return prefix + '.' + subfix.substr(0,2);				
			}
		}
		return '0';
	}
}
