define(['require','jquery','text!modules/toast/toast.html','css!modules/toast/toast.css'],function(require,$,text){
	return {
		show:function(val,opt){
			var dom = $(text);
			dom.find(".ql_message").html(val);
			$("body").append(dom);
			var life = 100;
			var toastLife = setInterval(function(){
				if(life<=0){
					dom.remove();
					clearInterval(toastLife);
				}
				dom.css({"opacity" : life/10})
				life--;
			},20);
		}
	}
})
