//整合拖拽时停止 拖动冲突
var pushed = 0;
var addItemSign = false;
var orgTree = {}
//关闭树操作
orgTree.closeTree = null;

var agent = navigator.userAgent.toLowerCase();
var regStr_ie = /msie [\d.]+;/gi;
var regStr_ff = /firefox\/[\d.]+/gi
var regStr_chrome = /chrome\/[\d.]+/gi;
var regStr_saf = /safari\/[\d.]+/gi;
var regStr_Opera = /Opera\/[\d.]+/gi;
$.browser = {};
//IE
if (agent.indexOf("msie") > 0) {
	//alert(browser); 
	$.browser.mise = true;
	$.browser.version = (agent.match(regStr_ie) + "").replace(/[^0-9.]/ig, "");
}
//firefox
if (agent.indexOf("firefox") > 0) {
	$.browser.mozilla = true;;
	$.browser.version = (agent.match(regStr_ff) + "").replace(/[^0-9.]/ig, "");
}
//Chrome
if (agent.indexOf("chrome") > 0) {
	$.browser.chrome = true;
	$.browser.version = (agent.match(regStr_chrome) + "").replace(/[^0-9.]/ig, "");
}
//Safari
if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
	$.browser.safari = true;
	$.browser.version = (agent.match(regStr_saf) + "").replace(/[^0-9.]/ig, "");
}
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var lastClientX = 0;
    var lastClientY = 0
    $(document).on("mousedown", '.dragscroll', function (e) {
        pushed = 1;
        $(".container").css("cursor", "url('/Areas/Theme/default/org/img/palm16x16.ico'),auto");
        lastClientX = e.clientX;
        lastClientY = e.clientY;
    });
    $(document).on("mouseup", function (e) {
        pushed = 0;
        $(".container").css("cursor", "url('/Areas/Theme/default/org/img/fist16x16.ico'),auto");
    });
    $(document).on("mousemove", function (e) {
        var dragged = $('.dragscroll');
        scroller = dragged[0];
        if (pushed) {
            scroller.scrollLeft -=
                (-lastClientX + (lastClientX = e.clientX));
            scroller.scrollTop -=
                (-lastClientY + (lastClientY = e.clientY));
        }
    });
}));
(function ($) {
    var ilevel = 1;
    var itemNode = null;
    var itemDrop = false;
    var nodefontText = "";

    function loadNodeLayer(sourceLi, num) {
        //modify parentId
        sourceLi.children("dl").attr("data-layer", num);
        
        sourceLi.children("ul").children("li").each(function (i, v) {
            loadNodeLayer($(this), num + 1);
        });
    }

    function getMaxLayer(sourceLi, oldnum) {
    	if(oldnum<1)oldnum=1;
    	var newnum = oldnum;
        sourceLi.children("ul").children("li").each(function (i, v) {
            var num = getMaxLayer($(this), oldnum + 1);
            if (newnum < num) newnum = num;
        });
        return newnum;
    }
    $.fn.jOrgChart = function (options) {
        var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
        var $appendTo = $(opts.chartElement);

        // build the tree
        $this = $(this);
        var $container = $("<div class='" + opts.chartClass + "'/>");
        if ($this.is("ul")) {
            buildNode($this.find("li:first"), $container, 0, opts);
        }
        else if ($this.is("li")) {
            buildNode($this, $container, 0, opts);
        }
        
        $appendTo.append($container);
        //加载完毕
         
        $(".first-node").each(function (i, v) {
            try {
                var td = $(this).closest(".node-cell");
                var node =td.children(".node");
                left = (td.width() - node.width()) / 2-40;
                $(this).css({ left: left + "px" })
            } catch (e) {
            }
        });
         $(".last-node").each(function (i, v) {
            try {
                var td = $(this).closest(".node-cell");
                var node =td.children(".node");
                right = (td.width() - node.width()) / 2-40;
                $(this).css({ right: right + "px" })
            } catch (e) {
            }
        });
        $('div.node').on("mouseover mousedown", function () {
            pushed = 0;
            $(".build-tree-canvas").removeClass("dragscroll");
        });
        $('div.node').on("mouseout", function () {
            $(".build-tree-canvas").addClass("dragscroll");
        });
        // add drag and drop if enabled
        if (opts.dragAndDrop) {
            $('div.node').draggable({
                cursor: 'move',
                distance: 40,
                helper: 'clone',
                opacity: 0.8,
                revert: 'invalid',
                revertDuration: 100,
                snap: 'div.node.expanded',
                snapMode: 'inner',
                stack: 'div.node',
                handle: 'dt',
                scrollSpeed:10,
                appendTo: '.container',
                helper: function () {
                    return '<dl class="nd-department-node nd-department-node-hover" style="position:relative;" ><dt style="margin-left:80px;" ><i class="zuzhijiagou iconfont">' + $(this).find(".zuzhijiagou").html() + '</i></dt><dd class="nd-department-font" style="margin-left:80px;">' + $(this).find(".nd-department-font").html() + '</dd></dl>';
                }
            });

            $('div.node').droppable({
                accept: '.node',
                activeClass: 'drag-active',
                hoverClass: 'drop-hover'
            });
            
            $('div.node-sort').droppable({
                accept: '.node-sort,.node',
                activeClass: 'drag-active',
                hoverClass: 'drop-hover',
                over: function (event, ui) {
                   // console.log("over");
                },
                drop: function (event, ui) {
                    var targetClass = $(this).parent().find(".nd-department-node").attr("data-nodeclass");

                    var targetLi = $this.find("li." + targetClass);
                    //  console.log(ui.draggable)
                    var sourceID = ui.draggable.data("tree-node");

                    var sourceLi = $this.find("li").filter(function () { return $(this).data("tree-node") === sourceID; });

                    if (sourceLi.hasClass(targetClass)) return;

                    var sourceUl = sourceLi.parent('ul');
                    
                    var dataLayer = targetLi.children("dl").data("layer");


                    var maxLayer = getMaxLayer(sourceLi, 0)

                    if ((dataLayer + maxLayer) > 5) {
                        ND.msgbox.show("部门层级最多支持5层！", 2);
                        return;
                    }


                    var parentId = targetLi.children("dl").attr("data-parentId");

                    var dataOrder = targetLi.children("dl").attr("data-order");

                    var sourceDelcls = sourceLi.children("dl").attr("data-nodeClass");

                    var val = sourceLi.children("dl").find(".nd-department-font").html();

                    repeat = false;
                    
                    $.each($this.find("." + targetClass).closest("ul").children("li:not(." + sourceDelcls + ")").children("dl").find(".nd-department-font"), function (i, v) {
                        if ($.trim($(this).html()) == $.trim(val)) {
                            repeat = true;
                            return false;
                        }
                    });

                    if (repeat) {
                        //reduction old val 
                        ND.msgbox.show("该部门下有同名部门！", 2);
                        return;
                    }

                    //modify order
                    sourceLi.children("dl").attr("data-parentId", parentId);

                    //修改层数
                    loadNodeLayer(sourceLi, dataLayer)

                    sourceLi.attr("modify", true);

                    //Removes any empty lists

                    if ($(this).data("position") == "left") {
                        targetLi.before(sourceLi);
                    } else {
                        targetLi.after(sourceLi);
                        dataOrder++;
                    }
                    sourceLi.children("dl").attr("data-order", dataOrder);

					var clazz=sourceLi.children("dl").data("nodeclass");
					
                    var sourceLicurent = $("#org").find("li." + clazz);

                    sourceLicurent.nextAll().each(function (i, v) {
                        dataOrder++;
                        $(this).children("dl").attr("data-order", dataOrder);
                        $(this).attr("modify", true);
                    });

                    if (sourceUl.children().length === 0) {
                        sourceUl.remove();
                    }
                }
            });
            // Drag start event handler for nodes
            $('div.node').bind("dragstart", function handleDragStart(event, ui) {
                pushed = 0;
                $(".build-tree-canvas").removeClass("dragscroll");
                $(".node-sort").removeClass("hide");
                var sourceNode = $(this);
                sourceNode.parentsUntil('.node-container')
                           .find('*')
                           .filter('.node')
                           .droppable('disable');
                sourceNode.parentsUntil('.node-container')
                           .find('*')
                           .filter('.node').first().addClass('nd-drag-dode');
                if (sourceNode.find(".btn-tree").hasClass("tree-close")) {
                    orgTree.closeTree = sourceNode.children("dl").attr("data-nodeclass");
                    sourceNode.find(".btn-tree").click();
                }
            });

            // Drag stop event handler for nodes
            $('div.node').bind("dragstop", function handleDragStop(event, ui) {
                pushed = 0;
                modifyItem = true;
                $(".build-tree-canvas").addClass("dragscroll");
                $(".node-sort").addClass("hide");
                //drop
               // if (itemDrop) {
                $(opts.chartElement).children(".jOrgChart").remove();
                $this.jOrgChart(opts);
                if (orgTree.closeTree) {
                    $("div." + orgTree.closeTree).find(".btn-tree").click();
                    orgTree.closeTree = null;
                }
                //} else {
                //    var sourceNode = $(this);
                //    sourceNode.parentsUntil('.node-container')
                //          .find('*')
                //          .filter('.node').first().removeClass('nd-drag-dode');
                //    itemDrop = false;
                //}
            });
          
            // Drop event handler for nodes
            $('div.node').bind("drop", function handleDropEvent(event, ui) {
                pushed = 0;
                var targetID = $(this).data("tree-node");
                var targetLi = $this.find("li").filter(function () { return $(this).data("tree-node") === targetID; });
                var targetUl = targetLi.children('ul');

                var sourceID = ui.draggable.data("tree-node");
                var sourceLi = $this.find("li").filter(function () { return $(this).data("tree-node") === sourceID; });
                var sourceUl = sourceLi.parent('ul');

                var targetDelcls = targetLi.children("dl").attr("data-nodeClass");

                var dataLayer = parseInt(targetLi.children("dl").attr("data-layer"));

                var maxLayer = getMaxLayer(sourceLi, 0)

                if ((dataLayer + maxLayer )>= 5) {
                    ND.msgbox.show("部门层级最多支持5层！", 2);
                    return;
                }

                var val = sourceLi.children("dl").find(".nd-department-font").html();

                var sourceDelcls = sourceLi.children("dl").attr("data-nodeClass");

                repeat = false;
                $.each($("#org").find("." + targetDelcls).children("ul").children("li:not(." + sourceDelcls + ")").children("dl").find(".nd-department-font"), function (i, v) {
                    if ($.trim($(this).html()) == $.trim(val)) {
                        repeat = true;
                        return false;
                    }
                });

                if (repeat) {
                    //reduction old val 
                    ND.msgbox.show("该部门下有同名部门！", 2);
                    return;
                }
                itemDrop = true;

                var dataOrder = 1;
                var parentId = targetLi.children("dl").attr("data-id");
                var last = $("#org").find("." + targetDelcls).children("ul").children("li:not(." + sourceDelcls + ")").last();
                //调换的节点加1
                dataLayer = dataLayer + 1;

                try {
                    if (last.children("dl").attr("data-order") != null) dataOrder = parseInt(last.children("dl").attr("data-order")) + 1;
                } catch (e) {
                }
                //modify layer
                sourceLi.children("dl").attr("data-order", dataOrder);
                //modify order
                sourceLi.children("dl").attr("data-parentId", parentId);
               

                loadNodeLayer(sourceLi, dataLayer);

                sourceLi.attr("modify", true);

                if (targetUl.length > 0) {
                    targetUl.append(sourceLi);
                } else {
                    targetLi.append("<ul></ul>");
                    targetLi.children('ul').append(sourceLi);
                }

                //Removes any empty lists
                if (sourceUl.children().length === 0) {
                    sourceUl.remove();
                }

            }); // handleDropEvent

        } // Drag and drop
    };

    // Option defaults
    $.fn.jOrgChart.defaults = {
        chartElement: 'body',
        depth: -1,
        chartClass: "jOrgChart",
        dragAndDrop: false
    };

    var nodeCount = 0;
    // Method that recursively builds the tree
    
    function buildNode($node, $appendTo, level, opts, order, currentnodenum) {
        var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>");
        var $tbody = $("<tbody/>");
        $node.attr("data-layer", level);
        //console.log(level);
        // Construct the node container(s)
        var $nodeRow = $("<tr/>").addClass("node-cells");
        var $nodeCell = $("<td/>").addClass("node-cell").attr("colspan", 2);
        //Exclude Delete node
        var $childNodes = $node.children("ul:first").children("li:not(.deleteNode)");
        var $nodeDiv;
        if ($childNodes.length == 0) {
            $node.children("dl").find(".nd-node-display").hide();
        } else {
            $node.children("dl").find(".nd-node-display").show();
        }
        if ($childNodes.length > 1) {
            $nodeCell.attr("colspan", $childNodes.length * 2);
        }
        // Draw the node
        // Get the contents - any markup except li and ul allowed
        var $nodeContent = $node.clone().children("ul,li")
                                .remove()
                                .end()
                                .html();

        //Increaments the node count which is used to link the source list and the org chart
        nodeCount++;
        $node.data("tree-node", nodeCount);
        $nodeDiv = $("<div>").addClass("node")
                                         .data("tree-node", nodeCount)
                                         .append($nodeContent);
        $nodeRow.hover(function () {
            itemNode = $nodeRow;
        }, function () {
            itemNode = null;
        })
        // Expand and contract nodes
        if ($childNodes.length > 0) {
            $nodeDiv.find("dt,.btn-tree").click(function () {
                var $this = $(this).closest("div");
                var $tr = $this.closest("tr");
                if ($tr.hasClass('contracted')) {
                    $this.css('cursor', 'n-resize');
                    $tr.removeClass('contracted').addClass('expanded');
                    $tr.nextAll("tr").css('visibility', '');
                    // Update the <li> appropriately so that if the tree redraws collapsed/non-collapsed nodes
                    // maintain their appearance
                    $node.removeClass('collapsed');
                    $this.find(".btn-tree").removeClass("tree-open");
                    $this.find(".btn-tree").addClass("tree-close");
                } else {
                    $this.css('cursor', 's-resize');
                    $tr.removeClass('expanded').addClass('contracted');
                    $tr.nextAll("tr").css('visibility', 'hidden');
                    $node.addClass('collapsed');
                    $this.find(".btn-tree").addClass("tree-open");
                    $this.find(".btn-tree").removeClass("tree-close");
                }
            });
        }
        $nodeCell.append($nodeDiv);
        if (level != "0") {
            var before = "";
            var after = "";
            if (currentnodenum && currentnodenum % 2 == 1) {
                before = $('<div  data-position="left" class="node-sort node-sort-left hide"><div class="node-sort-box"></div></div>');
                after = $('<div  data-position="right" class="node-sort node-sort-right hide"><div class="node-sort-box" ></div></div>');
                $nodeDiv.before(before);
                $nodeDiv.after(after);
            } else if (currentnodenum && currentnodenum % 2 == 0 && order == "last") {
                after = $('<div class="node-sort node-sort-right hide" data-position="right"><div class="node-sort-box"  ></div></div>');
                $nodeDiv.after(after);
            }
            if (order == "first" || order == "only") {
                before.addClass("first-node");
                try {
                    $nodeDiv.width();
                    //var left = (parseInt($nodeDiv.closest(".node-cell").width())-158)/2;
                    // before.css("left", left+"px");
                } catch (e) {
                }
            }
            if (order == "last" || order == "only") {
                after.addClass("last-node");
                try {
                    //var right =(parseInt($nodeDiv.closest(".node-cell").width())-158)/2;
                    // before.css("right",right+"px");
                } catch (e) {
                }
            }
        }
        $nodeRow.append($nodeCell);
        $tbody.append($nodeRow);

        if ($childNodes.length > 0) {
            // if it can be expanded then change the cursor
            $nodeDiv.css('cursor', 'n-resize');

            // recurse until leaves found (-1) or to the level specified
            if (opts.depth == -1 || (level + 1 < opts.depth)) {
                var $downLineRow = $("<tr/>");
                var $downLineCell = $("<td/>").attr("colspan", $childNodes.length * 2);
                $downLineRow.append($downLineCell);

                // draw the connecting line from the parent node to the horizontal line 
                $downLine = $("<div></div>").addClass("line down");
                $downLineCell.append($downLine);
                $tbody.append($downLineRow);

                // Draw the horizontal lines
                var $linesRow = $("<tr/>");
                $childNodes.each(function () {
                    var $left = $("<td>&nbsp;</td>").addClass("line left top");
                    var $right = $("<td>&nbsp;</td>").addClass("line right top");
                    $linesRow.append($left).append($right);
                });

                // horizontal line shouldn't extend beyond the first and last child branches
                $linesRow.find("td:first")
                            .removeClass("top")
                         .end()
                         .find("td:last")
                            .removeClass("top");

                $tbody.append($linesRow);
                var $childNodesRow = $("<tr/>");
                $childNodes.each(function (i,v) {
                    var $td = $("<td class='node-container'/>");
                    $td.attr("colspan", 2);

                    var order = "";
                    if (i == 0) order = "first";
                    if (i == ($childNodes.length - 1)) order = "last";
                    if ($childNodes.length == 1) order = "only";

                    // recurse through children lists and items
                    buildNode($(this), $td, level + 1, opts, order, i + 1);
                    $childNodesRow.append($td);
                });

            }
            $tbody.append($childNodesRow);
        }
       
        // any classes on the LI element get copied to the relevant node in the tree
        // apart from the special 'collapsed' class, which collapses the sub-tree at this point
        if ($node.attr('class') != undefined) {
            var classList = $node.attr('class').split(/\s+/);
            $.each(classList, function (index, item) {
                if (item == 'collapsed') {
                    $nodeRow.find(".btn-tree").addClass("tree-open");
                    $nodeRow.find(".btn-tree").removeClass("tree-close");
                    $nodeRow.nextAll('tr').css('visibility', 'hidden');
                    $nodeRow.removeClass('expanded');
                    $nodeRow.addClass('contracted');
                    $nodeDiv.css('cursor', 's-resize');
                } else {
                    $nodeDiv.addClass(item);
                }
            });
        }
        $table.append($tbody);
        $appendTo.append($table);
        /* Prevent trees collapsing if a link inside a node is clicked */

        //add Node
        $nodeDiv.find('.nd-node-plus').click(function (e) {
            if (modify == 0) {
                $(".node-ui-text").focus();
                return false;
            }
            var parentdl = $(this).closest("dl");
            var dataLayer = parseInt(parentdl.attr("data-layer")) + 1;
            if (dataLayer > 5) {
                ND.msgbox.show("部门层级最多限制5层!", 2);
                return false;
            }
            $('div.node').draggable('disable');
            var delcls = parentdl.attr("data-nodeClass");
            
            var parentId = parentdl.attr("data-id");
            var nodedom = $(nodehtml);
            var nodeId = "newnode" + new Date().getTime();
            nodedom.addClass(nodeId);
            nodedom.children("dl").attr("data-nodeClass", nodeId);
            nodedom.find(".nd-department-font").html("");
            //target li
            var delclsli=$("#org").find("." + delcls);
            if (delclsli.children("ul").length <= 0) {
                delclsli.append("<ul></ul>");
            }
            var dataOrder = 1;

            var last = delclsli.children("ul").find("li:last");
            try{
                if (last.children("dl").attr("data-order") != null) dataOrder = parseInt(last.children("dl").attr("data-order")) + 1;
            }catch(e){
            }
			nodedomdl=nodedom.children("dl");
            //modify layer
            nodedomdl.attr("data-layer", dataLayer);
            //modify order
            nodedomdl.attr("data-order", dataOrder);
            //modify parentId
            nodedomdl.attr("data-parentId", parentId);
            delclsli.children("ul").append(nodedom);
            nodedom.attr("newly", true);

            $(opts.chartElement).children(".jOrgChart").remove();
            $this.jOrgChart(opts);
            $(opts.chartElement).children(".jOrgChart").find("." + nodeId).find('.nd-department-font').click();
            modifyItem = true;
            modify = 1;
            addItemSign = true;
            e.stopPropagation();
        });
        //delete Node
        $nodeDiv.find('.nd-node-minus').click(function (e) {
            delNode = $(this);
            if (modify == 0) {
                var class1 = $(".node-ui-text").closest("dl").attr("data-nodeclass");
                var delcls = $(this).closest("dl").attr("data-nodeclass");
                if (addItemSign && class1 == delcls) {
                    ND.msgbox.hide();
                    //var delcls = delNode.closest("dl").attr("data-nodeClass");
                    //delete node and it's children node,identification delete as true
                    $("#org").find("." + delcls).attr("delete", true);
                    $("#org").find("." + delcls).addClass("deleteNode");
                    $("#org").find("." + delcls).find("li").attr("delete", true);
                    $("#org").find("." + delcls).find("li").addClass("deleteNode");
                    $(opts.chartElement).children(".jOrgChart").remove();
                    $this.jOrgChart(opts);
                    addItemSign = false;
                    modify = 1;
                } else { 
                 $(".node-ui-text").focus();
                 return false;
                }
            } else {
                var depName = $nodeDiv.find(".nd-department-font").html();
                NDDialog.confirm("确认要删除<span style='color:#59BAF5;font-size:12px;max-width:100px; display:inline-block;top: 6px; position: relative;' class='textoverflow'> " + depName + " </span>部门吗？<br/><span style='color:#FF0000;font-size:12px;'>(同时也会删除该部门下所有子部门)</span><br/><span style='color:#999999;font-size:13px;'>所有被删除部门的成员将会自动移至未分配列表</span>", function () {
                    var delcls = delNode.closest("dl").attr("data-nodeClass");
                    //delete node and it's children node,identification delete as true
                    $("#org").find("." + delcls).attr("delete", true);
                    $("#org").find("." + delcls).addClass("deleteNode");
                    $("#org").find("." + delcls).find("li").attr("delete", true);
                    $("#org").find("." + delcls).find("li").addClass("deleteNode");

                    $(opts.chartElement).children(".jOrgChart").remove();
                    $this.jOrgChart(opts);
                },null,null,360,170);
            }
            //$(this).closest("table").closest("tbody").children("tr").first().nextAll().remove();
            modifyItem = true;
            e.stopPropagation();
        });
        $nodeDiv.hover(function () {
            $(this).find("dt").addClass("zuzhijiagou-hover");
            $nodeDiv.find(".nd-node-handle").show();
        }, function () {
            $(this).find("dt").removeClass("zuzhijiagou-hover");
            $nodeDiv.find(".nd-node-handle").hide();
        });
        //modify Node
        $nodeDiv.find('.nd-department-font').click(function (ex) {  
            var nodefont = $(this);
            //is check now,so non trigger event 
            if ($(this).children(".node-ui-text").length > 0) return;
            //remenber old val
            var nodefontdl = nodefont.closest("dl");
            var layer = nodefontdl.attr("data-layer");
            if (layer <= 0) {
                return;
            }
            //状态改变
            if (modify == 0) {
                $(".node-ui-text").focus();
                return false;
            }
            var nodefontText = nodefont.text();
            var nodextext = $('<input class="node-ui-text" maxlength="50"/>');
            nodextext.val(nodefontText);
            nodefont.html(nodextext);
            nodextext.focus();
            $('div.node').draggable('disable');
            modify = 0;
            nodextext.select();
            $(document).keyup(function (e) {
                var val = nodextext.val();
                if (e && e.keyCode == 13) {
                    if ($.trim(val) == "") {
                        //reduction old val 
                        ND.msgbox.show("部门名称不能为空!", 2);
                        nodextext.val(nodefontText);
                        nodextext.focus();
                        return;
                    }
                    nodextext.blur();
                }
            });
            nodextext.blur(function (event) {
                var val = $(this).val();
                if ($.trim(val) == "") {
                    //reduction old val 
                    ND.msgbox.show("部门名称不能为空!", 2);
                    nodextext.val(nodefontText);
                    modify = 0;
                    nodextext.focus();
                    return;
                }
                var repeat = false;
                var delcls = nodefontdl.attr("data-nodeClass");
                //is repeat return false
                $.each($("#org").find("." + delcls).closest("ul").children("li:not(." + delcls + ")").not(".deleteNode").children("dl").find(".nd-department-font"), function (i, v) {
                    if ($.trim($(this).html()) == $.trim(val)) {
                        repeat = true;
                        return false;
                    }
                });
                if (repeat) {
                    //reduction old val 
                    ND.msgbox.show("同级部门不能重复!", 2);
                    $(this).val(nodefontText);
                    modify = 0;
                    nodextext.focus();
                    return;
                }
                var delcls = $(this).closest("dl").attr("data-nodeClass");
                //set permanent val
                $("#org").find("." + delcls).find(".nd-department-font").text(val);

                $("#org").find("." + delcls).attr("modify", true);
                nodefont.text(val);
                $('div.node').draggable('enable');
                modifyItem = true;
                addItemSign = false;
                modify = 1;
                ex.stopPropagation();
            });
        });
        return $this;
    };
})(jQuery);
