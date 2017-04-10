(function(widgetFactory) {
	if(typeof define === "function" && define.amd) {
		// AMD模式
		define("NDwebupload", ['modules/upload/js/webuploader', 'modules/upload/js/md5', 'text!modules/upload/html/jquery.upload.html'], function(webuploader, md5, html) {
			if(!webuploader.Uploader.support()) {
				alert('上传组件不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
				return null;
			}
			return widgetFactory($, true, webuploader, md5);
		})
	} else {
		if(!WebUploader.Uploader.support()) {
			alert('上传组件不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
			return null;
		}
		webuploader = new WebUploader;
		// 全局模式
		return widgetFactory(window.jQuery, false, webuploader);
	}
	
	//paradigm 是否为amd范式 
}(function($, paradigm, webuploader, md5, i18nJson) {

	//UC认证
	this._AuthHelper = {
		randomCode: function() {
			code = "";
			var codeLength = 8; //验证码的长度
			var chars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'); //所有候选组成验证码的字符，当然也可以用中文的

			for(var i = 0; i < codeLength; i++) {
				var charIndex = Math.floor(Math.random() * 36);
				code += chars[charIndex];
			}
			return code;
		},
		getAuthHeader: function(url, method) {
			var user_token = NDCookie.getCookie('user_token');
			if(user_token == null || user_token == "") return;
			var user_token_json = eval("user_token_json=" + user_token);
			var access_token = user_token_json.access_token;
			var mac_key = user_token_json.mac_key;

			if(!access_token || !mac_key || !window.CryptoJS) {
				return;
			}

			var strAuth = 'MAC id="' + access_token + '",nonce="';
			var nonce = new Date().getTime() + ':' + AuthHelper.randomCode();
			strAuth += nonce + '",mac="';

			var request_content = nonce + '\n' + method + '\n' + url + '\n' + window.location.host + '\n';
			var hash = CryptoJS.HmacSHA256(request_content, mac_key);
			var mac = hash.toString(CryptoJS.enc.Base64);
			strAuth += mac + '"';
			return strAuth;
		}
	}
	
	/****
	 * @param {Object} ndUpload 上传对象当前的dom元素
	 * @param {Object} json 配置参数
	 */
	function initUploadWidget(ndUpload, json) {
		var opt = $.extend({}, $.fn.NdUpload.Param.Default, json);
	}
	
	/**
	 * 加载组件
	 * @param {Object} json
	 */
	$.fn.NdUpload = function(json) {
		var _ndUpload = this;
		return initUploadWidget(_ndUpload, json);
	}
	
	
	/**
	 * jQuery 上传插件
	 * 
	 * */
	$.fn.NdUpload.Param={
		/****
		 * 初始化NDUploadHelp参数
		 */
		_NDUploadHelp = {
			sServerType: "", //服务器类型
			lServerCode: "", //服务器
			sDepCode: "", //部门编号
			sMenuCode: "", //模块编号
			sIP: "", //IP地址
			sPort: "", //端口号	
			sUserName: "", //用户名
			sPassWord: "", //密码
			sPath: "", //文件存放路径
			sCompany: "", //公司号
			sPostUrl: "", //文件路径
			sUpType: "", //文件存放路径
			SetFileFlt: "", //设置允许上传的文件类型
			setMaxSize: "", //设置上传的最大文件大小
			autoCreateId: true,
			HttpUrl: "", //拼接地址
			//以下为html5上传参数 Modify by lpx 2014.1.16
			bSdp: 0, //是否共享平台
			fileArray: [], //待上传文件队列数组
			oldFileArray: [], //已绑定文件队列数组
			successFileArray: [], //已上传文件队列数组
			fileSplitSize: 1024 * 1024 * 5, //文件分割上传大小 
			sIP2: "", //IP地址
			sPort2: "", //端口号
			sPostUrl2: "", //文件路径
			SetFileFlt2: "", //设置允许上传的文件类型
			setMaxSize2: "", //设置上传的最大文件大小
			singleUpload: false, //是否单文件上传，单值为true时不显示上传附件列表
			uploadPreview: false, //是否上传前预览，只有单文件上传的时候才能设置为true
			uploadCallback: null, //上传成功事件，非IE浏览器可使用该方法作为回调
			sCompanyCode: "", //公司编号
			Authorization: "",
			Session: "", //请求携带值
			uid: "",
			service_id: ""
		},
		_setAttribute:function(){
			
		},
		Default:{
			
		}
	}
}))