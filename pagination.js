//该版本两边sidePageCount!=0的时候还没有弄,,所以参数不能需要等于0
jQuery.fn.pagination = function(total,params){
	params = jQuery.extend({
		pageSize:10,
		paginationBarCount:10,
		currentPage:1,
		sidePageCount:0,
		link_to:"#",
		showPrev:true,
		showNext:true,
		showFirst:true,
		showLast:true,
		prev_text:"Prev",
		next_text:"Next",
		first_text:"首页",
		last_text:"尾页",
		callback:function(){return false;}
	},params||{});
	return this.each(function() {
		//计算总页数
		function numPages() {
			return Math.ceil(total/params.pageSize);
		}	
		//开始页码和结束页码
		function getStartAndEnd(){
			var count = params.paginationBarCount;
			var half = count/2;
			var totalPages = numPages();
			if(totalPages<=count)
				return [1,totalPages];
			if(currentPage-half<1)
				return [1,count];
			if(currentPage+half>totalPages)
				return [totalPages-count+1,totalPages]
			return [currentPage-Math.ceil(half)+1,currentPage+Math.floor(half)]
		}
		
		
		/**
		 * 分页链接事件处理函数
		 * @参数 {int} pageNum 为新页码
		 */
		function pageSelected(pageNum, evt){
			currentPage = pageNum<1||pageNum>numPages()?(pageNum<1?1:numPages()):pageNum;
			//drawLinks();
			var continuePropagation = params.callback(currentPage, panel);
			if (!continuePropagation) {
				if (evt.stopPropagation) {
					evt.stopPropagation();
				}
				else {
					evt.cancelBubble = true;
				}
			}
			return continuePropagation;
		}
		
		/**
		 * 此函数将分页链接插入到容器元素中
		 */
		function drawLinks() {
			panel.empty();
			var interval = getStartAndEnd();
			var totalPages = numPages();
			// 这个辅助函数返回一个处理函数调用有着正确pageNum的pageSelected。
			var getClickHandler = function(pageNum) {
				return function(evt){ return pageSelected(pageNum,evt); }
			}
			//辅助函数用来产生一个单链接(如果不是当前页则产生span标签)
			var appendItem = function(pageNum, appendparams){
				//pageNum = pageNum<1?1:(pageNum<totalPages?pageNum:totalPages); // 规范page id值
				appendparams = jQuery.extend({text:pageNum, classes:""}, appendparams||{});
				if(pageNum == currentPage){
					var link = jQuery("<span class='current'>"+(appendparams.text)+"</span>");
				}else{
					var link = jQuery("<a>"+(appendparams.text)+"</a>")
						.bind("click", getClickHandler(pageNum))
						.attr('href', params.link_to.replace(/__id__/,pageNum));		
				}
				if(appendparams.classes){link.addClass(appendparams.classes);}
				panel.append(link);
				//处理一下首页尾页,上一页下一页上面的样式
				if(currentPage == 1){
					$('.prev,.first').addClass('forbidden').unbind('click');
				}
				if(currentPage == totalPages){
					$('.next,.last').addClass('forbidden').unbind('click');
				}
			}
			//首页
			if(params.showFirst&&params.first_text)
				appendItem(0,{text:params.first_text,classes:'first'});
			
			// 产生"Previous"-链接
			if(params.prev_text && (currentPage > 1 || params.showPrev)){
				appendItem(currentPage-1,{text:params.prev_text, classes:"prev"});
			}
			// 产生内部的页码链接
			for(var i=interval[0]; i<=interval[1]; i++) {
				appendItem(i);
			}
			// 产生 "Next"-链接
			if(params.next_text && (currentPage < totalPages || params.showNext)){
				appendItem(currentPage+1,{text:params.next_text, classes:"next"});
			}
			//尾页
			if(params.showLast&&params.last_text)
				appendItem(totalPages+1,{text:params.last_text,classes:'last'});
		}
		
		//从选项中提取currentPage----dadssasa
		var currentPage = params.currentPage;
		//创建一个显示条数和每页显示条数值
		total = (!total || total < 0)?1:total;
		params.pageSize = (!params.pageSize || params.pageSize < 0)?1:params.pageSize;
		//存储DOM元素，以方便从所有的内部结构中获取
		var panel = jQuery(this);
		
		// 获得附加功能的元素,好像是给回调函数使用
		/*this.selectPage = function(pageNum){ pageSelected(pageNum);}
		this.prevPage = function(){
			if (currentPage > 0) {
				pageSelected(currentPage - 1);
				return true;
			}
			else {
				return false;
			}
		}
		this.nextPage = function(){ 
			if(currentPage < numPages()-1) {
				pageSelected(currentPage+1);
				return true;
			}
			else {
				return false;
			}
		}*/
		// 所有初始化完成，绘制链接
		drawLinks();
        // 回调函数
        //params.callback(currentPage + 1, this);
	});
}



