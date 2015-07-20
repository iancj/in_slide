$(function(){
	;(function(){
		var $slide=$("#j-in-slide"),
			$ul=$slide.find(".in-slide-list"),
			$li=$slide.find("li"),
			li_width=$li.offset().width,
			li_height=$li.height(),
			li_size=$li.size();

			$li.width(li_width)
			$slide.height(li_height);
			$ul.height(li_height).width((li_width+parseInt($li.css("margin-right")))*li_size);
	})();
});