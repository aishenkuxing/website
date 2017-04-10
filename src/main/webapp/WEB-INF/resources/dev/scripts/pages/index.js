 /****定义接收数据格式 开始**/
var data = {
    ChildItems: [],
    IndId: 1,
    LDepId: 1,
    LParentId: 0,
    SDepName: "云办公",
    SPath: "1|",
    SamId: 1,
    ScaId: 1
};

var nodehtml = '<li><dl class="nd-department-node"><dt><i class="zuzhijiagou iconfont" >&#xe657;</i></dt><dd class="nd-node-handle"><i class="nd-node-plus"></i><i class="nd-node-minus"></i></dd><dd class="nd-department-font">新建部门</dd><dd class="nd-node-display"><i class="btn-tree tree-close" style="cursor:auto;"></i></dd></dl></li>';
var ahtml = '<a href="javascript:void(0);"></a>';

 /****定义接收数据格式 结束**/
//缩放功能
function transformScale(dom, val) {
    if ($.browser.mise && parseInt($.browser.version) <= 9) {
        $(dom).css("zoom", val);
    } else {
        var scaleSize = "scale(" + val + "," + val + ")";
        $(dom).css("-moz-transform", scaleSize);
        $(dom).css("-webkit-transform", scaleSize);
        $(dom).css("-o-transform", scaleSize);
        $(dom).css("transform", scaleSize);
    }
}

 //添加子节点
    function appendChildItems(parent, nodes, lay) {
        var dataLayer = lay + 1;
        if (dataLayer > mlayer) mlayer = dataLayer;
        if (nodes && nodes.length > 0) {
            parent.append("<ul></ul>");
            $.each(nodes, function (i, v) {
                var DepId = v.LDepId || v.DepId;
                var nodeId = "node" + new Date().getTime() + 'id' + DepId;
                var nodedom = $(nodehtml);
                nodedom.addClass(nodeId);
                nodedom.children("dl").attr("data-id", DepId);
                nodedom.children("dl").attr("data-layer", dataLayer);
                nodedom.children("dl").attr("data-nodeClass", nodeId);
                nodedom.find(".nd-department-font").html(v.SDepName);
                parent.children("ul").append(nodedom);
                var flag = appendChildItems(nodedom, v.ChildItems, dataLayer);
            });
        }
    }


require(['jquery','jquery-ui/ui/widgets/draggable','jquery-ui/ui/widgets/droppable','modules/orgtree/orgtree'],function($){
 		if ($.browser.mise && $.browser.version == 10) {
            $(".org-container").addClass("ie10")
        }
	 $("#chart").html('<ul id="org" style="display:none"></ul>');
	    var DepId = data.LDepId || data.DepId;
	    var nodeId = "node" + new Date().getTime() + 'id' + DepId;
	    var nodedom = $(nodehtml);
	    nodedom.addClass(nodeId);
	    nodedom.find(".nd-node-minus").remove();
	    var lay = 0;
	    mlayer = 0;
	    
	    nodedom.find(".zuzhijiagou").html("&#xe61d;");
	    nodedom.children("dl").attr("data-nodeClass", nodeId);
	    nodedom.children("dl").attr("data-Order", data.LOrder);
	    nodedom.children("dl").attr("data-id", DepId);
	    nodedom.children("dl").attr("data-layer", lay);
	    nodedom.find(".nd-department-font").html(data.SDepName);
	    
	    appendChildItems(nodedom, data.ChildItems, lay, DepId);
	    
	    $("#org").html(nodedom);
	     //文档
        var org = $("#org").jOrgChart({
            chartElement: '#chart',
            dragAndDrop: true
        });
});