import { isOpenDatabase, openDb, addTab, addIndex, getDataList, updateSQL, customUpdateSQL, deleteTabItem, getCount } from "@/plugins/sqlite.js";
import { getNoticeList } from "./apiCommon.js";
import { updateNoticeUnreadCount, getLoginUserId } from "./storeCommon.js";

//存储公告Id
const NoticeKey = "NoticeId";
//公告表名
const NoticeTableName = "SysNotice";
//公告表字段
const NoticeColumns = [
	`"uId" INTEGER PRIMARY KEY AUTOINCREMENT`,
	`"loginId" INTEGER`, //当前登录用户Id
	`"id" INTEGER`,
	`"userId" INTEGER`,
	`"receiveUserId" INTEGER NULL`,
	`"receiveUserType" INTEGER`,
	`"type" INTEGER`,
	`"scope" INTEGER`,
	`"template" TEXT NULL`,
	`"title" TEXT NULL`,
	`"description" TEXT NULL`,
	`"isDelete" INTEGER`,
	`"createTime" TEXT`,
	`"createId" INTEGER`,
	`"updateTime" TEXT NULL`,
	`"updateId"  TEXT NULL`,
	`"isRead" INTEGER`,
	`"ext1" TEXT NULL`,
	`"ext2" TEXT NULL`,
	`"ext3" TEXT NULL`,
	`"ext4" TEXT NULL`,
	`"ext5" TEXT NULL`,
	`UNIQUE(loginId,id)` //组合唯一约束
];


//存储本数据
export const saveLocalData = (arr) => {
	if (arr && arr.length > 0) {
		//当前登录用户ID
		const currentUserId = getLoginUserId();
		const singleData = arr[0];
		const keys = Object.keys(singleData);
		const columns = keys.toString();
		let sql;
		if (arr.length > 1) {
			sql = [];
			arr.map(item => {
				const setData = keys.map(key => {
					return `'${item[key]}'`
				})
				sql.push(
					`insert or ignore into ${NoticeTableName}(${columns},loginId) values(${setData.toString()},${currentUserId})`
				);
			})
		} else {
			const setData = keys.map(key => {
				return `'${singleData[key]}'`
			})
			sql =
				`insert or ignore into ${NoticeTableName}(${columns},loginId) values(${setData.toString()},${currentUserId})`;
		}
		return new Promise((resolve, reject) => {
			customUpdateSQL(sql).then(res => {
				resolve(arr);
			}).catch(err => {
				reject(err);
			})
		});
	} else {
		return new Promise((resolve, reject) => {
			reject("缺少数据");
		})
	}
}

//初始化公告本地数据存储信息
export const initNoticeDB = () => {
	if (isOpenDatabase()) {
		addTab(NoticeTableName, NoticeColumns);
	} else {
		openDb().then(res => {
			addTab(NoticeTableName, NoticeColumns);
		}).catch(err => {
			console.log("Database open error", err);
		});
	}
}

//添加索引
const createIndex = (indexName, tableName, columns) => {
	const hasIndex = uni.getStorageSync(tableName);
	if(!hasIndex) {
		addIndex(indexName, tableName, columns).then(res => {
			uni.setStorageSync(tableName, "true");
		});
	}
}


//更新本地公告数据
export const updateLocalNotice = () => {
	//当前登录用户ID
	const currentUserId = getLoginUserId();
	const noticeId = uni.getStorageSync(NoticeKey + currentUserId) || "0";
	return new Promise((resolve, reject) => {
			getNoticeList({
				receiveUserType: 0,
				isPage: false,
				queryIdGt: noticeId,
				isPositiveOrder: true,
			}).then(res => {
				let list = res.list;
				const length = list.length;
				if (length > 0) {
					list.forEach(item => {
						item.isDelete = item.isDelete ? 1 : 0;
						item.isRead = 0;
					});
					resolve(list);
				} else {
					updateNoticeUnreadCount();
					reject("no data");
				}
			})
		}).then(res => {
			//添加表
			return addNoticeTable(res);
		}).then(res => {
			//存储本地数据
			return saveLocalData(res);
		}).then(res => {
			const count = res.length;
			return updateLastLocalId(res[count - 1].id, NoticeKey + currentUserId, count);
		}).then(res => {
			return new Promise((resolve, reject) => {
				updateNoticeUnreadCount();
				resolve(res);
			})
		})
		.catch(err => {
			return new Promise((resolve, reject) => {
				reject(err);
			})
		})
}



//查询本地公告数据
export const getLocalNoticeList = (num, size) => {
	//当前登录用户ID
	const currentUserId = getLoginUserId();
	return new Promise((resolve, reject) => {
		getDataList(NoticeTableName, num, size, `loginId = ${currentUserId}`, "uId", "desc").then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
			uni.showToast({
				icon: "none",
				title: '未获取到公告数据'
			});
		})
	})
}

//公告标记为已读
export const readLocalNotice = (id) => {
	return new Promise((resolve, reject) => {
		updateSQL(NoticeTableName, "isRead = 1", `uId = ${id}`).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		})
	});
}

//公告删除
export const deleteLocalNotice = (id) => {
	return new Promise((resolve, reject) => {
		deleteTabItem(NoticeTableName, `uId = ${id}`).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
			uni.showToast({
				icon: "none",
				title: '删除失败'
			});
		})
	});
}

//查询公告未读数量
export const getNoticeUnReadCount = () => {
	//当前登录用户ID
	const currentUserId = getLoginUserId();
	return new Promise((resolve, reject) => {
		getCount(NoticeTableName, `isRead = 0 and loginId = ${currentUserId}`).then((resNum) => {
			resolve(resNum[0].num);
		}).catch(err => {
			reject(err);
		})
	});
}

//添加表
const addNoticeTable = (data) => {
	return new Promise((resolve, reject) => {
		addTab(NoticeTableName, NoticeColumns).then(res => {
			resolve(data);
		}).catch(err => {
			reject(err);
		})
	})
}


//存储最后Id
const updateLastLocalId = (lastId, storageKey, count) => {
	return new Promise((resolve, reject) => {
		uni.setStorage({
			key: storageKey,
			data: lastId,
			success() {
				resolve(count);
			},
			fail() {
				reject();
			}
		})
	})
}
