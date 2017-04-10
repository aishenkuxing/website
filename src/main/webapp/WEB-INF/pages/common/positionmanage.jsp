<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>职位管理</title>
    </head>
    <style>
    	.g_panel_head .label_zhilei {
		    font-size: 16px;
		    color: #37a6ed;
		    font-weight: bold;
		    width: 140px;
		    background-color: #caebfe;
		    text-align: center;
		    border-right: 1px solid #cde4ed;
		    border-bottom: 1px solid #cde4ed;
		}
		.g_zhilei.showall {
		    height: auto;
		}
		.g_zhilei {
		    width: 100%;
		    background-color: #dff3ff;
		    white-space: normal;
		    position: relative;
		    height: 50px;
		    overflow: hidden;
		}
		.g_zhilei .zhilei_operates {
		    position: absolute;
		    width: 355px;
		    right: 0;
		    top: 0;
		    height: 50px;
		}
		.g_zhilei .zhilei_operate {
		    display: inline-block;
		    line-height: 25px;
		    vertical-align: middle;
		    color: #40abed;
		    font-weight: bold;
		    margin: 15px 3px 0;
		    float: left;
		}
		a {
		    text-decoration: none;
		    color: #6b6b6b;
		}
		.g_zhilei .create_zhilei, .g_col_operate .create_zhiZhong {
		    display: inline-block;
		    vertical-align: middle;
		    background-color: #fff;
		    border: 2px solid #40abed;
		    border-radius: 5px;
		    padding-left: 10px;
		    font-size: 14px;
		    margin: 15px 3px 0;
		    float: left;
		}
		.displayNone {
		    display: none !important;
		}
		.g_zhilei .zhilei_operate ins {
		    float: left;
		}
		.icon_add {
		    display: inline-block;
		    background-image: url("../images/rsdaweb/icon_sprite_25.png");
		    overflow: hidden;
		    vertical-align: middle;
		    background-position: -50px 0px;
		    width: 25px;
		    height: 25px;
		}
		ins {
		    text-decoration: none;
		}
		.g_zhilei .zhilei_operate ins {
		    float: left;
		}
		.icon_edit {
		    display: inline-block;
		    background-image: url("../images/rsdaweb/icon_sprite_25.png");
		    overflow: hidden;
		    vertical-align: middle;
		    background-position: -75px 0px;
		    width: 25px;
		    height: 25px;
		}
    </style>
    <body>
    	<table class="g_panel_head">
    		<thead>
    			<tr>
    				<td class="label_zhilei" colspan="2">职类</td>
    				<td>
    					<div class="g_zhilei showall" id="divZhiLei">
    						
    					</div>
    					<div class="zhilei_operates">
                            <a id="more_zhilei" href="javascript:;" class="zhilei_operate">
                                <ins class="icon_move_down"></ins>更多
                            </a>
                            <div class="create_zhilei displayNone" id="divAddZhiLei">
                                <input type="text" placeholder="请输入职类名称" id="txtAddZhiLei">
                                <div class="operate">
                                    <a href="javascript:;" class="save" id="aSaveZhiLei">保存</a>
                                    <a href="javascript:;" class="close" id="aCancelZhiLei">关闭</a>
                                </div>
                            </div>
                            <a href="javascript:;" class="zhilei_operate" id="aShowAddZhiLeiWin">
                                <ins class="icon_add"></ins>添加职类
                            </a>
                            <a href="javascript:;" class="zhilei_operate" id="aShowAddGroupZhiLeiWin">
                                <ins class="icon_edit"></ins>批量编辑
                            </a>
                        </div>
    				</td>
    			</tr>
    		</thead>
    	</table>
 	</body>
</html>