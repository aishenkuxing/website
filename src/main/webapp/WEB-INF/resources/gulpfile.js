'use strict';
const gulp = require('gulp'),
	fs = require('fs'),
	stream = require('stream'),
	del = require('del'),
	scombiner = require('stream-combiner2');

const gutil = require('gulp-util'),
	gchanged = require('gulp-changed'),
	greplace = require('gulp-replace'),					//gulp 替换文件        
	gwatch = require('gulp-watch'), 					//gulp watch文件   
	guglify = require('gulp-uglify'), 				 	//gulp 压缩文件        
	gconcat = require('gulp-concat'), 					//gulp 合并文件        
	gautoprefixer = require('gulp-autoprefixer'), 		//gulp css自适应    
	gcssmin = require('gulp-minify-css'), 				//gulp css压缩
	amdOptimize = require('amd-optimize'), 				//amd 合并打包
	grename = require('gulp-rename'), 					//gulp 重名文件
	gclean = require('gulp-clean'), 					//gulp 清除文件
	runSequence = require('run-sequence'), 				//独立运行任务
	plumber = require('gulp-plumber'); 					//防止管道中断

var resources = JSON.parse(fs.readFileSync('./resources.json'));  // require获取resources.json 配置

var __dev = 'dev', 												//开发环境目录
	__devFile = __dev + '/**/*.*', 								//开发环境目录文件
	__devFileJs = __dev + '/**/*.js', 							//开发环境目录Js文件
	__devFileCss = __dev + '/**/*.css',						//开发环境目录Css文件
	__devFileImage = __dev + '/**/*.{bmp,jpg,jpeg,png,gif}'; 	//开发环境目录Css文件

var __build = 'build',
	__buildFile = __build + '/**/*.*'; 							//生成环境目录文件

function getBuildFilePath(path) {
	var pathArr = path.split(__dev);
	if(pathArr.length > 1) {
		return __build + pathArr[1];
	}
}

/**
 * 压缩js使用默认参数值
 */
var _defUglify = {
	//mangle: true,//类型：Boolean 默认：true 是否修改变量名
	mangle: { except: ['require', 'exports', 'module', '$'] }, //排除混淆关键字
	compress: true, //类型：Boolean 默认：true 是否完全压缩
	preserveComments: 'all' //保留所有注释
};
/**
 * 压缩css使用默认参数值
 */
var _defCssmin = {
	advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
	compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
	keepBreaks: false, //类型：Boolean 默认：false [是否保留换行]
	keepSpecialComments: '*'
	//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
};
//清理目录
gulp.task('clear', function() {
	return gulp.src(__buildFile)
		.pipe(gclean());
});
/**
 * 合并任务
 */
gulp.task('concat', function() {
	gulp.src(__dev + '/plugs/bootstrap/**/*.js')
		.pipe(plumber())
		.pipe(gconcat('all.js')) //合并后的文件名
		.pipe(guglify(_defUglify))
		.pipe(gulp.dest(__build + '/plugs/bootstrap'));
});
/**
 * css压缩任务
 */
gulp.task('cssmin', function() {
	gulp.src(__devFileCss)
		.pipe(plumber())
		//.pipe(gcssmin(_defCssmin))
		.pipe(gulp.dest(__build));
});
/***
 * js压缩任务
 */
gulp.task('jsmin', function() {
	gulp.src(__devFileJs)
		.pipe(plumber())
		//.pipe(guglify(_defUglify))
		.pipe(gulp.dest(__build));
});

// 构建图片
gulp.task('images', function() {
	gulp.src(__dev + '/images/**/*.*')
		.pipe(plumber())
		.pipe(gulp.dest(__build + '/images'));
		
	return gulp.src(__devFileImage)
		.pipe(plumber())
		.pipe(gulp.dest(__build));
});

//gulp.task('templates', function(){
//gulp.src(['file.txt'])
//  .pipe(greplace('bar', 'foo'))
//  .pipe(gulp.dest('build/file'));
//});
/***
 * 监听开发目录是否变动 或者重载
 */
var watcher = gulp.watch(__devFile);

gulp.task('main', function(cb) {
	return runSequence(['images', 'jsmin', 'cssmin', 'concat']);
});

gulp.task('watch-file-change', function(cb) {
	watcher.on('change', function(event) {
		switch(event.type) {
			//删除操作
			case 'deleted':
				{
					var oldfile = getBuildFilePath(event.path);
					del([oldfile], cb);
					console.log('文件路径：' + oldfile + ',执行删除文件操作。');
					break;
				}
				//重命名操作
			case 'renamed':
				{
					var oldfile = getBuildFilePath(event.old);
					del([oldfile], cb);
					console.log('文件路径：' + oldfile + ',执行重命名操作。');
					break;
				}
			default:
				{
					console.log('文件路径：' + event.path + ',执行' + event.type + '操作。');
				}
				break;
		}
		//执行编译操作
		gulp.run('main');
	});
});

gulp.task('default', function(c) {
	return runSequence('clear', ['images', 'jsmin', 'cssmin', 'concat'], 'watch-file-change');
});