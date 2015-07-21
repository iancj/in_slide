$(function(){
	;(function(){
		var $slide=$("#j-in-slide"),
			$ul=$slide.find(".in-slide-list"),
			$li=$slide.find("li"),
			li_width=$li.offset().width,
			li_height=$li.height(),
			li_size=$li.size(),
			win_height=$(window).height(),
			win_width=$(window).width();

			$li.width(li_width)
			$slide.height(li_height);
			$ul
				.height(li_height)
				.width((li_width+parseInt($li.css("margin-right")))*li_size)
				.css("left",-li_width/2);

			var start={},
				delta={};

			var curIndex=1;//当前展示的

			//初始化
			function _setup(){
				$li.each(function(index,item){
					var scale= index==curIndex ? 1 : 0.88;

					$(item).css({
						"-webkit-transform":"translateX(0) scale("+scale+")",
						"transform":"translateX(0) scale("+scale+")"
					});
				})
			}

			_setup();

			var Events={
				start:function(e){
					e.preventDefault();

					var touch=e.touches[0];

					start={
						x:touch.pageX,
						y:touch.pageY
					}

					$ul[0].addEventListener("touchmove",Events.move,false);
					$ul[0].addEventListener("touchend",Events.end,false);

					// console.log(start)
				},
				move:function(e){
					e.preventDefault();

					var touch=e.touches[0];

					delta={
						x:touch.pageX-start.x,
						y:touch.pageY-start.y
					}

					var $cur=$li.eq(1);

					if(delta.x<0){
						var ratio=Math.abs(delta.x/win_height),
							curSize=li_size-1;
							prevIndex=(curIndex-1)<0 ? curSize : curIndex-1,
							nextIndex=(curIndex+1)>curSize ? curSize : curIndex+1;

						var cur_scale=1-ratio,
							prev_scale=0.88-0.88*ratio,
							next_scale=0.88+ratio;

						cur_scale=cur_scale<0.88 ? 0.88 : cur_scale;
						prev_scale=prev_scale<0.8 ? 0.8 : prev_scale;
						next_scale=next_scale>1 ? 1 : next_scale;

						$li.eq(curIndex).css({
							"-webkit-transform":"translateX("+delta.x+"px) scale("+cur_scale+")",
							"transform":"translateX("+delta.x+"px) scale("+cur_scale+")"
						});

						$li.eq(prevIndex).css({
							"-webkit-transform":"translateX("+delta.x+"px) scale("+prev_scale+")",
							"transform":"translateX("+delta.x+"px) scale("+prev_scale+")"
						});

						$li.eq(nextIndex).css({
							"-webkit-transform":"translateX("+delta.x+"px) scale("+next_scale+")",
							"transform":"translateX("+delta.x+"px) scale("+next_scale+")"
						});

						// console.log($li[prevIndex],$li[curIndex],$li[NextIndex])

					}


					// $li.eq(1-1).css({
					// 	"-webkit-transform":"translateX("+delta.x+"px) scale("+scale+")",
					// 	"transform":"translateX("+delta.x+"px) scale("+scale+")"
					// });

					// $cur.css({
					// 	"-webkit-transform":"translateX("+delta.x+"px)",
					// 	"transform":"translateX("+delta.x+"px)"
					// });

					// $ul.css({
					// 	"-webkit-transform":"translateX("+delta.x+"px)",
					// 	"transform":"translateX("+delta.x+"px)"
					// })

					// console.log(delta)
				},
				end:function(e){
					$ul[0].removeEventListener("touchmove",Events.move,false);
					$ul[0].removeEventListener("touchend",Events.end,false);
				}
			}

			$ul.on("touchstart",Events.start)
	})();
});