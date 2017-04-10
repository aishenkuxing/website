(function(factory) {
	if(typeof define === "function" && define.amd) {
		define([
			"jquery",
			"text!scripts/ui/orgtree/html/copy_node.html",
			"libs/jquery/jquery-ui/ui/widgets/draggable",
			"libs/jquery/jquery-ui/ui/widgets/droppable",
			"libs/jquery/jquery.json.min"
		], factory);
	} else {
		factory(jQuery, copy_node);
	}
}(function($, copy_node) {
	var pushed = 0;
	var lastClientX = 0;
    var lastClientY = 0
    $(document).on("mousedown", '.dragscroll', function (e) {
        pushed = 1;
        $(".container").css("cursor", "url("+window.cdnUrl+"theme/default/org/img/palm16x16.ico),auto");
        lastClientX = e.clientX;
        lastClientY = e.clientY;
    });
    $(document).on("mouseup", function (e) {
        pushed = 0;
        $(".container").css("cursor", "url("+window.cdnUrl+"theme/default/org/img/fist16x16.ico),auto");
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
	
	//jquery插件
	(function($) {
		var ilevel = 1;
		var itemNode = null;
		var itemDrop = false;
		var nodefontText = "";
		var nodeCount = 0;
		var scrollbox = 0;
		var orgTree = {};
		var mlayer = 0;
		//关闭树操作
		orgTree.closeTree = null;

		function loadNodeLayer(sourceLi, num) {
			//modify parentId
			sourceLi.children("dl").attr("data-layer", num);

			sourceLi.children("ul").children("li").each(function(i, v) {
				loadNodeLayer($(this), num + 1);
			});
		}

		function getMaxLayer(sourceLi, oldnum) {
			if(oldnum < 1) oldnum = 1;
			var newnum = oldnum;
			sourceLi.children("ul").children("li").each(function(i, v) {
				var num = getMaxLayer($(this), oldnum + 1);
				if(newnum < num) newnum = num;
			});
			return newnum;
		}
		//创建组织树
		createChartTree = function(nodes, layer, parentId, parent, opts) {
				var dataLayer = layer + 1;
				if(dataLayer > mlayer) mlayer = dataLayer;
				if(nodes && nodes.length > 0) {
					
					parent.append("<ul></ul>");
					
					$.each(nodes, function(i, v) {
						var nodedom = $('<li>' + copy_node + '</li>');
						var item = opts.createChartTree(v, nodedom , parentId , i);
						if(!item.order) item.order = i+1;
						var DepId = item.LDepId || item.DepId;
						var nodeId = "node" + new Date().getTime() + 'id' + DepId;
						nodedom.addClass(nodeId);
						nodedom.find(".nd-department-font").html(item.SDepName);
						nodedom.children("dl").attr("data-nodeClass", nodeId);
						nodedom.children("dl").attr("data-id", DepId);
						nodedom.children("dl").attr("data-order", item.order);
						nodedom.children("dl").attr("data-layer", dataLayer);
						nodedom.children("dl").attr("data-parentId", parentId);
						parent.children("ul").append(nodedom);
						var flag = createChartTree(item.ChildItems, dataLayer, DepId, nodedom, opts);
					});
				}
			}
			//创建root节点
		createRootItem = function(data, opts, $appendTo) {

			var orgNode = $('<ul style="display:none"></ul>');

			$appendTo.append(orgNode);

			var nodedom = $('<li>' + copy_node + '</li>');
			
			var item = opts.createChartTree(data, nodedom,null,0);
			
			if(opts.hasRoot){
				nodedom.find(".zuzhijiagou").html("&#xe61d;");
				//首节点去除多余的标签
				nodedom.find('.nd-node-handle').children('i').filter(function() {
					return !$(this).hasClass('nd-node-plus')&&!$(this).hasClass('nd-node-paste');
				}).remove();
			}
			
			var DepId = item.LDepId || item.DepId;
			var nodeId = "node" + new Date().getTime() + 'id' + DepId;
			//层级
			var layer = 0;
			mlayer = 0;
			nodedom.addClass(nodeId);
			nodedom.children("dl").attr("data-nodeClass", nodeId);
			nodedom.children("dl").attr("data-id", DepId);
			nodedom.children("dl").attr("data-order", 1);
			nodedom.children("dl").attr("data-layer", layer);

			nodedom.find('.nd-department-font').text(item.SDepName);
		
			createChartTree(item.ChildItems, layer, DepId, nodedom, opts);

			orgNode.append(nodedom);

			//$chartElement.append("<li><li>");
			return orgNode;
		}
		
		$.fn.jOrgChart = function(options) {
				var opts = $.extend({}, $.fn.jOrgChart.defaults, options);

				var $chartElement;

				var $appendTo = $(this);
				//第一次构建树
				if(opts.chartElement == '' && opts.repeatTree) {
					$chartElement = createRootItem(opts.data, opts, $appendTo);

					var id = "org" + new Date().getTime();

					$chartElement.attr("id", id);

					opts.chartElement = "#" + id;

					opts.repeatTree = false;
				}

				$chartElement = $(opts.chartElement);

				var $treeBox = $appendTo;

				// build the tree
				var $container = $("<div class='" + opts.chartClass + "'/>");
				if($chartElement.is("ul")) {
					buildNode($chartElement.find("li:first"), $container, $chartElement.find("li:first").data("layer"), opts, null, null, $treeBox);
				} else if($chartElement.is("li")) {
					buildNode($chartElement, $container, $chartElement.find("li:first").data("layer"), opts, null, null, $treeBox);
				}
				$appendTo.append($container);
				//加载完毕
				$(".first-node").each(function(i, v) {
					try {
						var td = $(this).closest(".node-cell");
						var node = td.children(".node");
						left = (td.width() - node.width()) / 2 - 40;
						$(this).css({
							left: left + "px"
						})
					} catch(e) {}
				});
				$(".last-node").each(function(i, v) {
					try {
						var td = $(this).closest(".node-cell");
						var node = td.children(".node");
						right = (td.width() - node.width()) / 2 - 40;
						$(this).css({
							right: right + "px"
						})
					} catch(e) {}
				});
				
				$('div.node').on("mouseover mousedown", function () {
		            pushed = 0;
		            $(".build-tree-canvas").removeClass("dragscroll");
		        });
		        $('div.node').on("mouseout", function () {
		            $(".build-tree-canvas").addClass("dragscroll");
		        });


				// add drag and drop if enabled
				if(opts.dragAndDrop) {
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
						scrollSpeed: 10,
						appendTo: '.container',
						helper: function() {
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
						over: function(event, ui) {
							// console.log("over");
						},
						drop: function(event, ui) {

							var targetClass = $(this).parent().find(".nd-department-node").attr("data-nodeclass");

							var targetLi = $(opts.chartElement).find("li." + targetClass);
							//  console.log(ui.draggable)
							var sourceID = ui.draggable.data("tree-node");

							var sourceLi = $chartElement.find("li").filter(function() {
								return $(this).data("tree-node") === sourceID;
							});

							if(sourceLi.hasClass(targetClass)) return;

							var sourceUl = sourceLi.parent('ul');

							var dataLayer = targetLi.children("dl").data("layer");

							//	                    var maxLayer = getMaxLayer(sourceLi, 0)
							//	
							//	                    if ((dataLayer + maxLayer) > 5) {
							//	                        ND.msgbox.show("部门层级最多支持5层！", 2);
							//	                        return;
							//	                    }
							var parentId = targetLi.children("dl").attr("data-parentId");

							var dataOrder = targetLi.children("dl").attr("data-order");

							var sourceDelcls = sourceLi.children("dl").attr("data-nodeClass");

							var val = sourceLi.children("dl").find(".nd-department-font").html();

							repeat = false;

							$.each($(opts.chartElement).find("." + targetClass).closest("ul").children("li:not(." + sourceDelcls + ")").children("dl").find(".nd-department-font"), function(i, v) {
								if($.trim($(this).html()) == $.trim(val)) {
									repeat = true;
									return false;
								}
							});

							if(repeat) {
								//reduction old val 
								ND.msgbox.show("该部门下有同名部门！", 2);
								return;
							}
							var clazz = sourceLi.children("dl").data("nodeclass");
							var sourceLicurent = $(opts.chartElement).find("li." + clazz);
							if($(this).data("position") != "left") {
								dataOrder++;
							}
							if(typeof opts.dropBrotherEvent === 'function'){
								//事件触发 必须返回true才执行之后的操作
								if(!opts.dropBrotherEvent(  sourceLicurent ,targetLi ,dataOrder ,opts)){
									return false;
								}
							}
							if($(this).data("position") == "left") {
								targetLi.before(sourceLi);
							} else {
								targetLi.after(sourceLi);
							}
							//modify order
							sourceLi.children("dl").attr("data-parentId", parentId);

							//修改层数
							loadNodeLayer(sourceLi, dataLayer)

							sourceLi.attr("modify", true);

							//Removes any empty lists
							
							sourceLi.children("dl").attr("data-order", dataOrder);
							//对之后的节点 排序进行加1的操作
							sourceLicurent.nextAll().each(function(i, v) {
								dataOrder++;
								$(this).children("dl").attr("data-order", dataOrder);
								$(this).attr("modify", true);
							});
							if(sourceUl.children().length === 0) {
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
						if(sourceNode.find(".btn-tree").hasClass("tree-close")) {
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
						$appendTo.children(".jOrgChart").remove();
						$appendTo.jOrgChart(opts);
						if(orgTree.closeTree) {
							$("div." + orgTree.closeTree).find(".btn-tree").click();
							orgTree.closeTree = null;
						}
					});

					// Drop event handler for nodes
					$('div.node').bind("drop", function handleDropEvent(event, ui) {
						pushed = 0;
						var targetID = $(this).data("tree-node");
						var targetLi = $chartElement.find("li").filter(function() {
							return $(this).data("tree-node") === targetID;
						});
						var targetUl = targetLi.children('ul');

						var sourceID = ui.draggable.data("tree-node");
						var sourceLi = $chartElement.find("li").filter(function() {
							return $(this).data("tree-node") === sourceID;
						});
						var sourceUl = sourceLi.parent('ul');

						var targetDelcls = targetLi.children("dl").attr("data-nodeClass");

						var dataLayer = parseInt(targetLi.children("dl").attr("data-layer"));

						//	                var maxLayer = getMaxLayer(sourceLi, 0)
						//	
						//	                if ((dataLayer + maxLayer )>= 5) {
						//	                    ND.msgbox.show("部门层级最多支持5层！", 2);
						//	                    return;
						//	                }

						var val = sourceLi.children("dl").find(".nd-department-font").html();

						var sourceDelcls = sourceLi.children("dl").attr("data-nodeClass");

						repeat = false;
						$.each($("#org").find("." + targetDelcls).children("ul").children("li:not(." + sourceDelcls + ")").children("dl").find(".nd-department-font"), function(i, v) {
							if($.trim($(this).html()) == $.trim(val)) {
								repeat = true;
								return false;
							}
						});

						if(repeat) {
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
							if(last.children("dl").attr("data-order") != null) dataOrder = parseInt(last.children("dl").attr("data-order")) + 1;
						} catch(e) {}

						//modify layer
						sourceLi.children("dl").attr("data-order", dataOrder);

						//modify order
						sourceLi.children("dl").attr("data-parentId", parentId);

						loadNodeLayer(sourceLi, dataLayer);

						sourceLi.attr("modify", true);

						if(targetUl.length <= 0) {
							targetLi.append("<ul></ul>");
							targetUl = targetLi.children('ul');
						}
						
						if(typeof opts.dropNodeEvent==='function') {
							if(!opts.dropNodeEvent(targetUl , sourceLi ,opts ,$treeBox)){
								return false;
							}
						}
						else targetUl.append(sourceLi);
						
						//Removes any empty lists
						if(sourceUl.children().length === 0) {
							sourceUl.remove();
						}

					}); // handleDropEvent

				} // Drag and drop
				
				if(typeof opts.finishEvent==='function'){
					opts.finishEvent(opts);
				}
				return opts.chartElement;
			}
			// Option defaults
		$.fn.jOrgChart.defaults = {
			//依赖到父节点
			chartElement: '',

			depth: -1,

			chart: '',

			chartClass: "jOrgChart",
			
			//是否开启拖拽功能
			dragAndDrop: false,
			
			//事件集合
			eventSet: null,
			
			//最高层级
			maxLayer: null,
			
			//弹框信息
			alert: null,
			
			hasRoot:true,

			//重新构造树
			repeatTree: true,
			//当加载完毕后执行方法
			finishEvent:null,
			
			//当节点拖拽到某个节点下，放下时触发事件
			dropNodeEvent:null  //function(targetUl , sourceLi , opts){}
			,
			//当置于左右节点，时触发事件,//事件触发 必须返回true才执行之后的操作 function( sourceLi , targetLi ,dataOrder) dataOrder 调整完的 位置
			dropBrotherEvent:null,
			//每次遍历的时候 会把子结点数据带入到数据中
			//用于自定义更改数据 dom为当前li节点 格式必须正确 否则加载会错误
			createChartTree: function( item, dom ,parentId,index) {
				/****定义接收数据格式 开始**/
				var data = {
					ChildItems: [],
					IndId: 1,
					LDepId: 1,
					LParentId: 0,
					SDepName: "",
					SPath: "1|",
					SamId: 1,
					ScaId: 1
				};
				return data;
			},
			data: {}
		};

		function buildNode($node, $appendTo, level, opts, order, currentnodenum, $treeBox) {
			if(level == null) level = 0;
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
			if($childNodes.length == 0) {
				$node.children("dl").find(".nd-node-display").hide();
			} else {
				$node.children("dl").find(".nd-node-display").show();
			}
			if($childNodes.length > 1) {
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
			$nodeRow.hover(function() {
				itemNode = $nodeRow;
			}, function() {
				itemNode = null;
			});

			// Expand and contract nodes
			if($childNodes.length > 0) {
				$nodeDiv.find("dt,.btn-tree").click(function() {
					var $this = $(this).closest("div");
					var $tr = $this.closest("tr");
					if($tr.hasClass('contracted')) {
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

			if(level != "0") {
				var before = "";
				var after = "";
				if(currentnodenum && currentnodenum % 2 == 1) {
					before = $('<div  data-position="left" class="node-sort node-sort-left hide"><div class="node-sort-box"></div></div>');
					after = $('<div  data-position="right" class="node-sort node-sort-right hide"><div class="node-sort-box" ></div></div>');
					$nodeDiv.before(before);
					$nodeDiv.after(after);
				} else if(currentnodenum && currentnodenum % 2 == 0 && order == "last") {
					after = $('<div class="node-sort node-sort-right hide" data-position="right"><div class="node-sort-box"  ></div></div>');
					$nodeDiv.after(after);
				}
				if(order == "first" || order == "only") {
					before.addClass("first-node");
					try {
						$nodeDiv.width();
						//var left = (parseInt($nodeDiv.closest(".node-cell").width())-158)/2;
						// before.css("left", left+"px");
					} catch(e) {}
				}
				if(order == "last" || order == "only") {
					after.addClass("last-node");
					try {
						//var right =(parseInt($nodeDiv.closest(".node-cell").width())-158)/2;
						// before.css("right",right+"px");
					} catch(e) {}
				}
			}
			$nodeRow.append($nodeCell);
			$tbody.append($nodeRow);

			if($childNodes.length > 0) {
				// if it can be expanded then change the cursor
				$nodeDiv.css('cursor', 'n-resize');

				// recurse until leaves found (-1) or to the level specified
				if(opts.depth == -1 || (level + 1 < opts.depth)) {
					var $downLineRow = $("<tr/>");
					var $downLineCell = $("<td/>").attr("colspan", $childNodes.length * 2);
					$downLineRow.append($downLineCell);

					// draw the connecting line from the parent node to the horizontal line 
					$downLine = $("<div></div>").addClass("line down");
					$downLineCell.append($downLine);
					$tbody.append($downLineRow);

					// Draw the horizontal lines
					var $linesRow = $("<tr/>");
					$childNodes.each(function() {
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
					$childNodes.each(function(i, v) {
						var $td = $("<td class='node-container'/>");
						$td.attr("colspan", 2);

						var order = "";
						if(i == 0) order = "first";
						if(i == ($childNodes.length - 1)) order = "last";
						if($childNodes.length == 1) order = "only";

						// recurse through children lists and items
						buildNode($(this), $td, level + 1, opts, order, i + 1, $treeBox);

						$childNodesRow.append($td);
					});

				}
				$tbody.append($childNodesRow);
			}

			// any classes on the LI element get copied to the relevant node in the tree
			// apart from the special 'collapsed' class, which collapses the sub-tree at this point
			if($node.attr('class') != undefined) {
				var classList = $node.attr('class').split(/\s+/);
				$.each(classList, function(index, item) {
					if(item == 'collapsed') {
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

			$nodeDiv.hover(function() {
				if($(this).find("dt").hasClass("not-hover"))return;
				$(this).find("dt").addClass("zuzhijiagou-hover");
				$nodeDiv.find(".nd-node-handle").show();
			}, function() {
				if($(this).find("dt").hasClass("not-hover"))return;
				$(this).find("dt").removeClass("zuzhijiagou-hover");
				$nodeDiv.find(".nd-node-handle").hide();
			});

			if(typeof opts.eventSet === 'function') {
				//处理结点操作
				opts.eventSet($nodeDiv, opts, $treeBox, copy_node);
			}

			return $node;
		}
	})(jQuery)
}))