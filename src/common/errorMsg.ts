/*
 * @Author: Heath 
 * @Date: 2022-10-18 09:44:44 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-05 10:52:45
 * @content what is the content of this file. */

const errorCode: { [index: string]: string } = {
	//1** token 相关
	"100": "token 不存在",
	"101": "登录状态已过期",
	"102": "您的操作过于频繁，请稍后再试",
	"103": "请不要重复操作",    // 重复操作接口，执行时间较长，拒绝再次请求
	"104": "用户名密码不匹配",


	//2** 与资源权限有关
	"201": "没有操作权限",
	"202": "资源不存在",
	"203": "操作失败",

	//3** 参数相关
	"301": "参数缺失",
	"302": "参数格式不合法",

	// 5** 具体业务
	"500": "未捕获错误",

	// user Model
	"550": "邮箱已占用，请使用其它邮箱",

};

export default errorCode;
