/***
 * 上传组件 amd范式
 */
(function(widgetFactory) {
	if(typeof define === "function" && define.amd) {
		// AMD模式
		define("NDwebupload", ['libs/upload/js/webuploader', 'libs/upload/js/md5', 'promise!i18nForControl'], function(webuploader, md5, i18n) {
			var i18nJson = i18n['cloudoffice_control_ndwebupload'] || {};
			if ( !webuploader.Uploader.support() ) {
		        alert( '上传组件不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
		        return null;
		    }
			return widgetFactory($, true, webuploader, md5, i18nJson);
		});
	} else {
		if ( !WebUploader.Uploader.support() ) {
	        alert( '上传组件不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
	        throw new Error( 'WebUploader does not support the browser you are using.' );
	    }
		webuploader = new WebUploader;
		// 全局模式
		return widgetFactory(window.jQuery, false, webuploader, i18nJson);
	}
	//paradigm 是否为amd范式 
}(function($, paradigm, webuploader, md5, i18nJson) {

	i18nJsonStr = {
		get_config_failed: i18nJson.get_config_failed || "获取配置失败！",
		get_file_failed: i18nJson.get_file_failed || "添加文件失败！",
		file_limit_num: i18nJson.file_limit_num || "文件最多只能上传{0}个",
		single_limit_size: i18nJson.single_limit_size || "单文件不能超过{0}",
		total_limit_size: i18nJson.total_limit_size || "总文件不能超过{0}",
		download: i18nJson.download || "下载",
		faild: i18nJson.faild || "失败",
		upload: i18nJson.upload || "上传文件",
		filename:i18nJson.filename||"文件名称",
		drag_msg:i18nJson.drag_msg||"拖拽至此上传"
	}

	var attachment = '<div><div class="article-head attachment-head">附件</div><div class="attachment-list clx"></div></div>';

	//初始化NDUploadHelp参数
	var NDUploadHelp = {
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
	};

	//UC认证
	this.AuthHelper = {
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

	var uploadDom = {
			ndupoadercontainer: '<div class="nd-webupload"><div class="btn-add-accessory nd-btn-add-accessory" href="javascript:;"></div>',
			nduploaderdl: '<dl class="ui-accessory" style="margin-left:10px; "><img class="nduploader-img" src=""><a class="close nduploader-delfile" href="javascript:void(0);"></a><div class="accessory-content"><p class="name nduploader-filename">'+i18nJsonStr.filename+'</p><div class="clx nduploader-progress"><span class="size nduploader-file-size">0k</span><div class="ui-progress"><div class="progress-bar nduploader-progress-color" style="width: 0%"></div></div><a class="down nduploader-file-status" href="javascript:;void(0);"></a></div></div></dl>',
			ndfilesList: '<div class="nduploader-files" style="background-color:#eee;min-height:50px;width:600px; padding-top:10px; position:relative; clear:both; border:1px dashed #ccc;"><div class="dragText" style=" position:absolute;top:50%;margin-top:-14px; left:50%; margin-left:-50px; font-size:16px;">'+i18nJsonStr.drag_msg+'</div></div>',
			dragText: '<div class="dragText" style=" position:absolute;top:50%;margin-top:-14px; left:50%; margin-left:-50px; font-size:16px;">'+i18nJsonStr.drag_msg+'</div>'
		}
		// 添加的文件数量
	this.fileCount = 0;
	// 添加的文件总大小
	this.fileSize = 0;
	this.ndQueue = ".nduploader-files";

	//pedding为没有文件
	this.states = {
		start: 0,
		ready: 1,
		uploading: 2,
		paused: 3,
		confirm: 4,
		pedding: 5,
		finish: 6,
		done: 7,
		reset: 8
	}
	this.setState = function(state, uploader, opt) {
		switch(state) {
			case states.start:
				$(opt._containerId).find(ndQueue).show();
				break;
			case states.pedding:
				$(opt._containerId).attr("filecount", 0);
				$(opt._containerId).attr("filesize", 0);
				if($.browser.msie && parseInt($.browser.version) <= 9) {
					$(opt._dndId).empty();
				} else $(opt._dndId).html(uploadDom.dragText);
				uploader.refresh();
				break;
			case states.ready:
				$(opt._containerId).attr("filecount", fileCount);
				$(opt._containerId).attr("filesize", fileSize);
				$(opt._dndId).find(".dragText").remove();
				uploader.refresh();
				break;
			case states.uploading:
				break;
			case states.paused:
				break;
			case states.confirm:
				break;
			case states.finish:
				break;
			case states.reset:
				$(opt._containerId).attr("filecount", 0);
				$(opt._containerId).attr("filesize", 0);
				if($.browser.msie && parseInt($.browser.version) <= 9) {
					$(opt._dndId).empty();
					$(opt._dndId).hide();
				} else $(opt._dndId).html(uploadDom.dragText);
				uploader.reset();
				break;
		}
	}

	/////////////缩略图片
	this.fileThumImage = function(fileExt, src) {
		var img = window.baseUrl + "/ui/upload/image/file.png";
		if(fileExt == "jpg" || fileExt == "gif" || fileExt == "jpeg" || fileExt == "png") {
			img = src;
		} else if(fileExt == "zip") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_zip.png";
		} else if(fileExt == "rar") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_rar.png";
		} else if("rm|rmvb|mpeg1－4|mov|mtv|dat|wmv|avi|3gp|amv|dmv|flv".indexOf(fileExt) >= 0) {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_avi.png";
		} else if(fileExt == "css") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_css.png";
		} else if(fileExt == "csv") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_csv.png";
		} else if(fileExt == "html") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_html.png";
		} else if(fileExt == "mp3") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_mp3.png";
		} else if(fileExt == "pdf") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_pdf.png";
		} else if(fileExt == "ppt") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_ppt.png";
		} else if(fileExt == "raw") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_raw.png";
		} else if(fileExt == "tif") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_tif.png";
		} else if(fileExt == "txt") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_txt.png";
		} else if(fileExt == "wav") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_wav.png";
		} else if(fileExt == "doc" || fileExt == "docx" || fileExt == "dot" || fileExt == "dotx" || fileExt == "docm") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_doc.png";
		} else if(fileExt == "xlsx" || fileExt == "xls" || fileExt == "xlt" || fileExt == "xla" || fileExt == "xlw") {
			img = window.baseUrl + "/ui/upload/attachmentIcons/icon_xls.png";
		} else {
			img = window.baseUrl + "/ui/upload/image/file.png";
		}
		return img;
	}

	this.addFile = function(file, uploader, opt) {
			filename = sameNameArr(opt, file.name);
			file.name = filename.substring(0, filename.lastIndexOf("."));
			switch(opt.dnd) {
				case 0:
					break;
				default:
					var li = $(uploadDom.nduploaderdl);
					li.attr("id", file.id);
					li.find(".nduploader-filename").html(filename);

					var size = uploadSizeStr(file.size);
					li.find(".nduploader-file-size").html(size);

					uploader.makeThumb(file, function(error, ret) {
						var fileImage = ret;
						if(error) fileImage = fileThumImage(file.ext)
						li.find(".nduploader-img").attr("src", fileImage);
					});
					li.find(".nduploader-delfile").click("click", function() {
						if(opt.onFileDel) opt.onFileDel(file, li);
						li.remove();
						fileCount = parseInt($(opt._containerId).attr("filecount"));
						uploader.removeFile(file);
						uploader.cancelFile(file);
						fileCount--;
						fileSize -= file.size;
						$(opt._containerId).attr("filecount", fileCount)
						if(!fileCount || fileCount <= 0) setState(states.pedding, uploader, opt);
					});
					if(opt.position == "after") $(opt._dndId).append(li);
					else $(opt._dndId).prepend(li);
					break;
			}

		}
		//计算文件hash值
	this.hashString = function(str) {
			var hash = 0,
				i = 0,
				len = str.length,
				_char;

			for(; i < len; i++) {
				_char = str.charCodeAt(i);
				hash = _char + (hash << 6) + (hash << 16) - hash;
			}
			return hash;
		}
		//获取文件偏移值
	this.getFileOffset = function(serverpath, file) {
			var url = serverpath + '?action=checkupload&file_name=' + file.name + '&file_size=' + file.size;
			$.ajax({
				url: url,
				async: false,
				data: {
					file_path: file.file_path,
					file_dna: file.file_dna
				},
				success: function(res) {
					res = eval('(' + res + ')')
					if(res && res.file_offset > 0) {
						file.file_offset = res.file_offset;
						//初始化进度条
						$("#" + file.id).find(".nduploader-progress-color").width((file.size / file.file_offset) + '%');
					} else {
						file.file_offset = 0;
					}
				}
			});
		}
		//读取文件配置信息
	this.createUpload = function(opt) {
		//读取配置文件
		$.ajax({
			url: "/api/cloudoffice/UploadApi/getUploadConfig.ashx?_sMenuCode=" + opt.MenuCode,
			type: "POST",
			async: false,
			success: function(config) {
				if(config && config.upload) {
					NDUploadHelp.sCompanyCode = config.sCompanyCode;
					NDUploadHelp.sDepCode = config.sDepCode;
					NDUploadHelp.sUserName = config.upload.sUserName; //用户名
					NDUploadHelp.sPassWord = config.upload.sPassWord; //密码
					NDUploadHelp.sPath = config.upload.sPath; //密码
					NDUploadHelp.sPostUrl = ""; //文件路径
					NDUploadHelp.sUpType = ""; //文件存放路径
					NDUploadHelp.setMaxSize = config.upload.sMaxSize;
					NDUploadHelp.HttpUrl = config.HttpUrl;
					NDUploadHelp.bSdp = config.upload.bSdp;
					NDUploadHelp.Session = config.Session;

					NDUploadHelp.uid = config.uid;
					NDUploadHelp.service_id = config.service_id;
					// NDUploadHelp.
					file_path = config.upload.sPath;
				} else {
					opt.alert(i18nJsonStr.get_config_failed, 2);
				}
			}
		});
		//获取共享平台session
		/*$.ajax({
			type: "POST",
			async: false,
			headers: {
				"Authorization": NDUploadHelp.Authorization
			},
			contentType: "application/json",
			url: 'http://cs-dev-qa.beta.web.sdp.101.com/v0.1/sessions',
			data: JSON.stringify({
				"path": NDUploadHelp.sPath,                         //授权的路径（包含子目录项） 必选
				"service_id": "a4f5b210-86ad-448b-ba64-331951b1cc86", //服务Id(UUID)               必选
				"uid": 950716,                                           //用户uid                    必选
				"role": "user",                                       //用户角色                   必选
				"expires": 100                                        //过期时间(秒)  默认1800     可选
			}),
			success: function (json) {
				NDUploadHelp.sPassWord = json.session;
			}
		});*/
		return NDUploadHelp;
	}

	this.sameNameArr = function(opt, name, i, oldname) {
		var newname = name;
		if(oldname == null) oldname = name;
		if(i == null) i = 1;
		$(opt._dndId).find(".nduploader-filename").each(function() {
			var targetName = $(this).html();
			if(name == targetName) {
				newname = oldname.substring(0, oldname.lastIndexOf(".")) + "(" + i + ")" + oldname.substring(oldname.lastIndexOf("."), oldname.length);
				newname = sameNameArr(opt, newname, ++i, oldname);
			}
		});
		return newname;
	}

	//填充容器
	this.setContainer = function(opt, containerId, pickerId, dndId, name) {

			var ndContainerDom = $(uploadDom.ndupoadercontainer);

			var dndFilesList = $(uploadDom.ndfilesList);

			dndFilesList.attr('id', dndId);

			dndFilesList.width(opt.dndWidth);

			dndFilesList.css("min-height", opt.dndHeight);

			ndContainerDom.attr("id", containerId);

			ndContainerDom.find(".btn-add-accessory").attr("id", pickerId);

			var btn = ndContainerDom.find(".nd-btn-add-accessory");

			btn.width(opt.width);

			if(name == "" || name == null) btn.html("<span class='nd-btn-span-accessory'></span>" + opt.name);
			else btn.html(name);
			//设置文件总数
			ndContainerDom.attr("filecount", 0);
			//设置文件总容量
			ndContainerDom.attr("filesize", 0);

			loadList(opt, ndContainerDom, dndFilesList);

			return ndContainerDom;
		}
		//加载列表
	this.loadList = function(opt, ndContainerDom, dndFilesList) {
		switch(opt.dnd) {
			case 1:
				ndContainerDom.append(dndFilesList);
				if($.browser.msie && parseInt($.browser.version) <= 9) {
					dndFilesList.empty();
					dndFilesList.hide();
				}
				break;
			case 0:
				break;
			default:
				$(opt.dnd).append(dndFilesList);
				break;
		}
	}

	this.uploadSizeStr = function(singleFileSize) {
			var size = "1k";
			if(singleFileSize > 1000000) {
				size = parseInt(singleFileSize / 1000000) + "M";
			} else if(singleFileSize > 1000) {
				size = parseInt(singleFileSize / 1000) + "k";
			}
			return size;
		}
		/**
		 * 加载组件
		 * @param {Object} json
		 */
	$.fn.NdMultiUpload = function(json) {
		var ndUpload = this;
		var upload = null;
		if(paradigm) {
			//amd范式
			return inituploadWidget(ndUpload, json);
		} else {
			return inituploadWidget(ndUpload, json);
		}
	};

	function inituploadWidget(ndUpload, json) {
		 
		var name = $(ndUpload).html();

		$(ndUpload).html("");

		var NDUploadHelp = $.extend({}, {}, NDUploadHelp);

		var opt = $.extend({}, $.fn.NdMultiUpload.Default, json);

		var containerId = "ndMultiuploader-container" + new Date().getTime();

		var pickerId = "ndMultuploader-picker" + new Date().getTime();

		//拖拽控件id
		var dndId = "nduploader-files" + new Date().getTime();

		var ndContainerDom = setContainer(opt, containerId, pickerId, dndId, name);

		$(ndUpload).append(ndContainerDom);

		opt._dndId = "#" + dndId;

		opt._containerId = "#" + containerId;

		opt._pickerId = "#" + pickerId;

		$.ajax({
			url: "/api/cloudoffice/UploadApi/getUploadConfig.ashx?_sMenuCode=" + opt.MenuCode,
			type: "POST",
			async: false,
			success: function(config) {
				if(config && config.upload) {
					NDUploadHelp.sCompanyCode = config.sCompanyCode;
					NDUploadHelp.sDepCode = config.sDepCode;
					NDUploadHelp.sIP = config.upload.sIP;
					NDUploadHelp.sPort = config.upload.sPort;
					NDUploadHelp.sUserName = config.upload.sUserName; //用户名
					NDUploadHelp.sPassWord = config.upload.sPassWord; //密码
					NDUploadHelp.sPath = config.upload.sPath; //密码
					NDUploadHelp.sPostUrl = ""; //文件路径
					NDUploadHelp.sUpType = ""; //文件存放路径
					NDUploadHelp.setMaxSize = config.upload.sMaxSize;
					NDUploadHelp.HttpUrl = config.HttpUrl;
					NDUploadHelp.bSdp = config.upload.bSdp;
					NDUploadHelp.Session = config.Session;
					
					file_path = config.upload.sPath;
				} else {
					opt.alert(i18nJsonStr.get_config_failed, 2);
				}
			},
			error: function() {
				opt.alert(i18nJsonStr.get_config_failed, 2);
			}
		});

		//请求上传路径判断
		var server = "";
		var serverpath = "";
		if(NDUploadHelp.bSdp == 1) {
			server = NDUploadHelp.HttpUrl + "/upload";
		} else {
			server = 'http://' + NDUploadHelp.sIP + ':' + NDUploadHelp.sPort + "/CloudOfficeUpload/UploadDealD.aspx" + '?action=' + opt.action + '&MenuCode=' + opt.MenuCode;
			serverpath = 'http://' + NDUploadHelp.sIP + ':' + NDUploadHelp.sPort + "/CloudOfficeUpload/UploadDealD.aspx";
		}
		var bSdp = NDUploadHelp.bSdp;
		//创建上传
		var uploader = webuploader.create({
			// 选完文件后，是否自动上传。
			auto: opt.auto,
			// swf文件路径
			swf: window.cdnUrl + 'scripts/ui/upload/js/Uploader.swf',

			chunkSize: 1048576,

			chunked: true,

			fileNumLimit: opt.fileNumLimit,

			threads: 1,

			fileSingleSizeLimit: opt.fileSizeLimit,

			fileSizeLimit: opt.fileSizeLimit, //文件限制大小

			dnd: (opt.dnd == 0) ? undefined : opt._dndId,

			duplicate: opt.duplicate,

			alert: opt.alert,
			// 文件接收服务端。
			server: server,
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: {
				id: opt._pickerId,
				multiple: !opt.single
			},
			accept: opt.accept
		});
		uploader.Id = opt._containerId;

		uploader.on('beforeFileQueued', function(file) {
			fileCount = parseInt($(opt._containerId).attr("filecount"));
			fileSize = parseInt($(opt._containerId).attr("filesize"));

			if(typeof opt.beforeFileQueued === "function") {
				if(!opt.beforeFileQueued(file)) {
					opt.alert(i18nJsonStr.get_file_failed, "beforeFileQueuedError");
					return false;
				};
			}

			if(fileCount >= opt.fileNumLimit) {
				opt.alert(i18nJsonStr.file_limit_num.replace("{0}", opt.fileNumLimit), 2);
				return false;
			}
			if(opt.singleFileSize && file.size > opt.singleFileSize) {
				var size = uploadSizeStr(opt.singleFileSize);
				opt.alert(i18nJsonStr.single_limit_size.replace("{0}", size), 2);
				return false;
			}

			//判断文件限制大小
			if(opt.fileTotalSizeLimit && opt.fileTotalSizeLimit < (fileSize + file.size)) {
				var size = uploadSizeStr(opt.fileTotalSizeLimit);
				opt.alert(i18nJsonStr.total_limit_size.replace("{0}", size), 2);
				return false;
			}
			//重置队列
			if(opt.single) {
				setState(states.reset, uploader, opt);
			}
		});
		//删除所有文件
		uploader.delAllFile = function() {
			$.each(uploader.getFiles(), function(i, v) {
				uploader.removeFile(v);
			});
			setState(states.pedding, uploader, opt);
		};
		//添加文件
		uploader.addFiles = function(arr) {
				$.each(arr, function(i, file) {
					fileCount = parseInt($(opt._containerId).attr("filecount"));
					fileSize = parseInt($(opt._containerId).attr("filesize"));
					if(opt.singleFileSize && file.size > opt.singleFileSize) {
						var size = uploadSizeStr(opt.singleFileSize);
						opt.alert(i18nJsonStr.single_limit_size.replace("{0}", size), 2);
						return;
					}
					if(opt.fileTotalSizeLimit && opt.fileTotalSizeLimit < (fileSize + file.size)) {
						var size = uploadSizeStr(opt.fileTotalSizeLimit);
						opt.alert(i18nJsonStr.total_limit_size.replace("{0}", size), 2);
						return false;
					}
					var li = $(uploadDom.nduploaderdl);
					li.attr("id", file.id);
					li.data("json", file.json);
					li.addClass("nduploader-old-file");
					li.find(".nduploader-filename").html(file.name);
					var size = uploadSizeStr(file.size);

					li.find(".nduploader-file-size").html(size);

					file.ext = file.ext.replace(".", "");
					//文件缩略图
					var fileImage = fileThumImage(file.ext, file.src);
					li.find(".nduploader-img").attr("src", fileImage);

					////////
					li.find(".nduploader-delfile").click("click", function() {
						if(opt.onFileDel) opt.onFileDel(file, li);
						fileCount = parseInt($(opt._containerId).attr("filecount"));
						fileCount--;
						li.remove();
						$(opt._containerId).attr("filecount", fileCount);
						if(!fileCount || fileCount <= 0) setState(states.pedding, uploader, opt);
					});
					li.find(".ui-progress").hide();
					li.find(".nduploader-file-status").html(i18nJsonStr.download);
					//附件下载链接 添加
					if(file.src.indexOf('&')>0&&file.src.indexOf('?')>0) li.find(".nduploader-file-status").attr("href", file.src+'&attachment=true');
					else li.find(".nduploader-file-status").attr("href", file.src + '?attachment=true');
					li.find(".nduploader-file-status").attr("target", "_blank");
					setState(states.ready, uploader, opt);
					if(fileCount == null || fileCount == 0) {
						fileCount = 0;
						fileSize = 0;
					}
					fileCount++;
					fileSize += file.size;
					$(opt._containerId).attr("filecount", fileCount);
					$(opt._containerId).attr("filesize", fileSize);
					if($(opt._dndId).is(":hidden")) $(opt._dndId).show();
					if(opt.position == "after") $(opt._dndId).append(li);
					else $(opt._dndId).prepend(li);
				});
			}
			//上传成功时绑定事件
		uploader.on('uploadSuccess', function(file, res) {
			$("#" + file.id).find(".ui-progress").hide();
			$("#" + file.id).addClass("uploadSuccess");
			setState(states.finish, uploader, opt);
			if(res._raw) {
				var logger = eval("(" + res._raw + ")");
				if(logger.result == 0) {
					$("#" + file.id).find(".nduploader-file-status").html(i18nJson.faild);
				} else {
					if(bSdp == 1) {
						if(opt.uploadSuccess) opt.uploadSuccess(file, NDUploadHelp.HttpUrl + "/download?dentryId=" + logger.dentry_id + "&path=" + logger.path, logger);
						$("#" + file.id).find(".nduploader-file-status").html(i18nJsonStr.download);
						$("#" + file.id).find(".nduploader-file-status").attr("href", NDUploadHelp.HttpUrl + "/download?dentryId=" + logger.dentry_id + "&path=" + logger.path + "&attachment=true");
						$("#" + file.id).find(".nduploader-file-status").attr("target", "_blank");
					} else {
						if(opt.uploadSuccess) opt.uploadSuccess(file, NDUploadHelp.HttpUrl + res.file_name, logger);
						$("#" + file.id).find(".nduploader-file-status").html(i18nJsonStr.download);
						$("#" + file.id).find(".nduploader-file-status").attr("href", NDUploadHelp.HttpUrl + res.file_name + "&attachment=true");
						$("#" + file.id).find(".nduploader-file-status").attr("target", "_blank");
						//$("#" + file.id).find(".nduploader-file-status").attr("href", 'http://' + NDUploadHelp.sIP + ':' + NDUploadHelp.sPort + "?filenamelen=" + file.size + "&opentype=5&" + res.file_name);
					}
				}
			}
		});

		//上传之前的操作
		uploader.on("uploadBeforeSend", function(obj, data, headers) {
			var file = obj.file;
			var NDUploadHelp = file.NDUploadHelp;
			uploader.fileSizeLimit = NDUploadHelp.setMaxSize;
			file.DepCode = NDUploadHelp.sDepCode;
			file.company = NDUploadHelp.sCompanyCode;
			file.file_path = NDUploadHelp.sPath;
			uploader.fileSizeLimit = NDUploadHelp.setMaxSize;

			if(NDUploadHelp.bSdp != 1) {
				var auth = AuthHelper.getAuthHeader(server, "POST");
				if(auth) {
					headers.Authorization = auth;
				}
				data.file_dna = file.file_dna;
				data.DepCode = file.DepCode;
				if(file.file_offset > file.size) {
					data.file_offset = file.size - data.file_offset
				} else {
					data.file_offset = file.file_offset;
					file.file_offset += 1048576;
				}
				data.company = file.company;
				data.file_path = file.file_path;
				data.file_size = file.size;
				data.file_len = file.size;
				data.ThumSize = opt.ThumSize;
				data.path = NDUploadHelp.sPath;
			} else {
				data.chunkSize = 1048576;
				data.chunks = file.chunks;
				data.chunk = file.chunk;
				file.chunk = file.chunk + 1;
				data.pos = 1048576 * data.chunk;
				data.path = NDUploadHelp.sPath;
				delete data["id"];
				delete data["type"];
				delete data["lastModifiedDate"];
				data.name = file.name + "." + file.ext;
				data.session = NDUploadHelp.Session;
				data.scope = 1;
				data.service_id = NDUploadHelp.service_id;
				data.size = file.size;
			}
			
			for(var key in opt.headers) {
                headers[key] = opt.headers[key];
            } 
		});

		uploader.on("uploadAccept", function(file, res) {
			fileCount = parseInt($(opt._containerId).attr("filecount"));
			fileSize = parseInt($(opt._containerId).attr("filesize"));
			if(opt.fileTotalSizeLimit && opt.fileTotalSizeLimit < (fileSize + file.size)) {
				return false;
			}
			if(res) {
				var logger = eval("(" + res._raw + ")");
				if(logger.result == 0) {
					if(opt.alert) {
						opt.alert(logger.msg, 2);
					} else {
						alert(logger.msg);
					}
					if(opt.uploadSuccess) opt.uploadSuccess(file, res);
					$("#" + file.id).find(".nduploader-file-status").html(i18nJson.faild);
					if(opt.uploadError) opt.uploadError(file, res);
					return false;
				} else {
					return true;
				}
			}
		});

		//选中文件进行校验	
		uploader.onFileQueued = function(file) {
			fileCount = parseInt($(opt._containerId).attr("filecount"));
			fileSize = parseInt($(opt._containerId).attr("filesize"));
			if(fileCount == null || fileCount == 0) {
				setState(states.start, uploader, opt);
			}
			fileCount++;
			fileSize += file.size;
			if(typeof opt.onFileQueued === "function") opt.onFileQueued(file, fileCount, fileSize);
			addFile(file, uploader, opt);
			setState(states.ready, uploader, opt);
			file.chunks = Math.ceil(file.size / 1048576);
			file.chunk = 0;
			file.NDUploadHelp = createUpload(opt);
			file.file_path = file.file_path;
			var hash = file.__hash || (file.__hash = hashString(file.name +
				file.size + file.lastModifiedDate));
			file.file_dna = hex_md5(hash);
			if(bSdp != 1) getFileOffset(serverpath, file);
		};
		uploader.on('uploadStart', function(file) {

		});
		uploader.on('uploadComplete', function(file) {
			// console.log(file);
		});
		uploader.on('uploadFinished', function(file, res) {
			//console.log(file);
			//console.log(res);
		});
		uploader.on('uploadError', function(file) {
			$("#" + file.id).find(".ui-progress").hide();
			$("#" + file.id).find(".nduploader-file-status").html(i18nJson.faild);
		});
		uploader.onUploadProgress = function(file, percentage) {
			$("#" + file.id).find(".ui-progress").show();
			$("#" + file.id).find(".nduploader-file-status").html("")
				// 及时显示进度
			$("#" + file.id).find(".nduploader-progress-color").width(percentage * 100 + '%');
		};
		uploader.ThumImage = function(url, size) {
			if(bSdp == 1) {
				return url + "&size=" + size;
			} else {
				return url.substring(0, url.lastIndexOf(".")) + "_thum" + size + "," + size + url.substring(url.lastIndexOf("."), url.length);
			}
		}
		uploader.on("uploadComplete", function(file) {
			if(opt.uploadComplete) {
				opt.uploadComplete(file);
			}
		});
		return uploader;
	}

	//必传 MenuCode
	//
	//uploader.delAllFile 删除所有文件，清空队列
	//uploader.addFiles(file) ::::file{id:"文件唯一标示符",name:"文件名称",size:"10000 文件大小 单位：b",ext:"文件后缀名",src:"文件链接",json:"携带的数据"}  添加初始化文件信息
	//
	//onFileDel(file,li)删除文件时触发,li为当前删除节点jquery对象 li.data("json")可以获取携带值，li.index() 为当前索引值
	//action 上传方式 默认断点续传  fileupload普通上传 （）
	//ThumSize:300*300|500*500  //上传回调缩略图格式
	//duplicate 是否可以重复 不校验重复
	//uploadSuccess(file,res) 上传成功回调的函数,file为文件对象,res为服务端返回的数据
	//uploadError(file,res)   文件上传失败后回调数据,
	//uploadComplete(file) 上传完成后的操作（不论失败，还是成功）
	//dnd:选定拖拽容器 默认为1 0时隐藏，其他则设置为对应地点
	//single:是否为单位件上传,默认按钮！如果添加新的按钮，请使用addButton中的属性multiple:false
	//File 初始化file对象
	//MenuCode
	//alert(msg,flag) 自定义alert方法
	//fileTotalSizeLimit 限制文件总大小，默认不做限制
	//初始化后可以获取
	//beforeFileQueued(file) 上传之前的操作，return false 当前上传终止，并且在上传队列中去除,return false ,alert方法中的flag 将标识为beforeFileQueuedError
	//uploadFinished 所有文件上传结束后触发
	//引申 upload.getFiles()可以获取 文件队列
	//引申 upload.addFiles()可以添加 文件队列
	//uploader.addButton{id:自定义ID，multiple：设置是否可以多选,innerHTML :指定按钮html}
	//singleFileSize 单个文件限制大小

	$.fn.NdMultiUploadShow = function(json) {
			var opt = $.extend({}, $.fn.NdMultiUploadShow.Default, json);
			var attachmentDom = $(attachment);
			if(opt.name) {
				attachmentDom.children(".attachment-head").html(opt.name);
			}
			if(opt.width) {
				attachmentDom.width(opt.width);
			}
			var attachmentList = attachmentDom.children(".attachment-list");
			if(opt.files) {
				$.each(opt.files, function(i, file) {

					var size = uploadSizeStr(file.LSize);

					file.ext = file.ext.replace(".", "");
					//判断是否为图片格式
					if(".jpg|jpg|gif|.gif|jpeg|.jpeg|png|.png".indexOf(file.ext) >= 0) {
						if(opt.showImage) {
							attachmentList.append('<dl><dt class="file-type"><span><img src="' + file.src + '" width="45" height="45"/></span></dt><dd> <span title="' + file.name + '">' + file.name + '</span><p>' + size + '<a href="' + file.src + '&attachment=true" target="_blank">' + i18nJsonStr.download + '< /a></p > < /dd></dl > ');
						}
					} else {
						/////////////缩略图片
						var  img=fileThumImage(file.ext);
						// ZipAttachment.push(file)
						//$("#attachment-list-ishide").show();
						attachmentList.append('<dl><dt class="file-type"><span><img src="' + img + '"</span></dt><dd> <span title="' + file.name + '">' + file.name + '</span><p>' + size + '<a href="' + file.src + '&attachment=true" target="_blank">' + i18nJsonStr.download + '</a></p></dd></dl>');
					}
				});
			}
			$(this).append(attachmentDom);
		}
		//上传显示组件

	//
	//name 标签名称,默认显示“附件”
	//showImage 是否显示图片
	//width 控件宽度显示,默认 100%
	//files 文件数组。 文件格式[{id:"文件唯一标示符",ext:文件格式(后缀名),size:文件大小 单位：b",name:文件名称,src:"文件路径",json:"携带的数据"}]
	$.fn.NdMultiUploadShow.Default = {
		name: null,
		showImage: false,
		width: null,
		files: []
	}
	//必传 MenuCode
	//
	//uploader.delAllFile 删除所有文件，清空队列
	//uploader.addFiles(file) ::::file{id:"文件唯一标示符",name:"文件名称",size:"10000 文件大小 单位：b",ext:"文件后缀名",src:"文件链接",json:"携带的数据"}  添加初始化文件信息
	//
	//onFileDel(file,li)删除文件时触发,li为当前删除节点jquery对象 li.data("json")可以获取携带值，li.index() 为当前索引值
	//action 上传方式 默认断点续传  fileupload普通上传 （）
	//ThumSize:300*300|500*500  //上传回调缩略图格式
	//duplicate 是否可以重复 不校验重复
	//uploadSuccess(file,res) 上传成功回调的函数,file为文件对象,res为服务端返回的数据
	//uploadError(file,res)   文件上传失败后回调数据,
	//uploadComplete(file) 上传完成后的操作（不论失败，还是成功）
	//dnd:选定拖拽容器 默认为1 0时隐藏，其他则设置为对应地点
	//single:是否为单位件上传,默认按钮！如果添加新的按钮，请使用addButton中的属性multiple:false
	//File 初始化file对象
	//MenuCode
	//alert(msg,flag) 自定义alert方法
	//fileTotalSizeLimit 限制文件总大小，默认不做限制
	//初始化后可以获取
	//beforeFileQueued(file) 上传之前的操作，return false 当前上传终止，并且在上传队列中去除,return false ,alert方法中的flag 将标识为beforeFileQueuedError
	//uploadFinished 所有文件上传结束后触发
	//引申 upload.getFiles()可以获取 文件队列
	//引申 upload.addFiles()可以添加 文件队列
	//uploader.addButton{id:自定义ID，multiple：设置是否可以多选,innerHTML :指定按钮html}
	//singleFileSize 单个文件限制大小
	$.fn.NdMultiUpload.Default = {
		name: i18nJsonStr.upload,
		single: false,
		width: 80,
		action: "bpupload",
		MenuCode: '100',
		ServerCode: "",
		fileSizeLimit: undefined,
		ThumSize: "",
		onFileDel: null,
		duplicate: true,
		sucess: null,
		auto: true,
		fileNumLimit: undefined,
		onFileQueued: null,
		singleFileSize: null,
		uploadder: 1,
		filesList: 1,
		dnd: 1,
		dndWidth: 392,
		dndHeight: 50,
		position: "after",
		headers: {'Accept': '*/*'},
		fileTotalSizeLimit: undefined,
		alert: function(val) {
			alert(val);
		},
		// 只允许选择图片文件。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/*'
		},
		uploadError: null,
		uploadSuccess: null,
		beforeFileQueued: null,
		uploadComplete: null
			//error:null
	}

}));