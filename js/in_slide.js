$(function(){
	;(function(){
		var $slide=$("#j-in-slide"),
			$ul=$slide.find(".in-slide-list"),
			$li=$slide.find("li"),
			li_width=$li.offset().width,
			li_margin=parseInt($li.css("margin-right")),
			li_height=$li.height(),
			li_size=$li.size(),
			win_height=$(window).height(),
			win_width=$(window).width();

			$li.width(li_width)
			$slide.height(li_height);
			$ul
				.height(li_height)
				.width((li_width+li_margin)*li_size)
				.css("left",-li_width/2);

			var start={},
				delta={};

			var curIndex=1,
				maxIndex=li_size-1,
				prevIndex,
				nextIndex,
				beforePrevIndex,
				afterNextIndex;

			var $curDom,
				$prevDom,
				$nextDom,
				$beforePrevDom,
				$afterNextDom;

			var requestAnimation=window.requestAnimationFrame ||
								window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.msRequestAnimationFrame;

			//初始化
			function _setup(){
				_updateIndex();

				$li.each(function(index,item){
					var scale;

					switch(index){
						case curIndex:
							scale=1;
							break;
						case prevIndex:
						case nextIndex:
							scale=0.88;
							break;
						default:
							scale=0.7;
							break;
					}

					$(item).css({
						"-webkit-transform":"translateX(0) scale("+scale+")",
						"transform":"translateX(0) scale("+scale+")",
						"-webkit-transition":"all 0.3s linear",
						"transition":"all 0.3s linear"
					});
				})
			}

			function _updateIndex(){
				prevIndex=(curIndex-1)<0 ? maxIndex : curIndex-1,
				nextIndex=(curIndex+1)>maxIndex ? maxIndex : curIndex+1,
				beforePrevIndex=(prevIndex-1)<0 ? maxIndex : prevIndex-1,
				afterNextIndex=(nextIndex+1)>maxIndex ? maxIndex : nextIndex+1;

				$curDom=$li.eq(curIndex);
				$prevDom=$li.eq(prevIndex);
				$nextDom=$li.eq(nextIndex);
				$beforePrevDom=$li.eq(beforePrevIndex);
				$afterNextDom=$li.eq(afterNextIndex);

				console.log(beforePrevIndex,prevIndex,curIndex,nextIndex,afterNextIndex)
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

					$curDom.css({
						"-webkit-transform":"translateX(0) scale(1)",
						"transform":"translateX(0) scale(1)",
					});

					$prevDom.css({
						"-webkit-transform":"translateX("+(-li_width)+"px) scale(0.88)",
						"transform":"translateX("+(-li_width)+"px) scale(0.88)",
					});

					$nextDom.css({
						"-webkit-transform":"translateX("+li_width+"px) scale(0.88)",
						"transform":"translateX("+li_width+"px) scale(0.88)",
					});

					$beforePrevDom.css({
						"-webkit-transform":"translateX("+(-li_width)*2+"px) scale(0.7)",
						"transform":"translateX("+(-li_width)*2+"px) scale(0.7)",
					});

					$afterNextDom.css({
						"-webkit-transform":"translateX("+li_width*2+"px) scale(0.7)",
						"transform":"translateX("+li_width*2+"px) scale(0.7)",
					});

					$ul[0].addEventListener("touchmove",Events.move,false);
					$ul[0].addEventListener("touchend",Events.end,false);
				},
				translate:function(dist){
					if(dist<0){
						var ratio=Math.abs(dist/win_height);

						var cur_scale=1-ratio,
							prev_scale=0.88-0.88*ratio,
							next_scale=0.88+ratio,
							afterNext_scale=0.7+0.88*ratio;

						if(cur_scale<0.88) cur_scale=0.88;
						if(prev_scale<0.7) prev_scale=0.7;
						if(next_scale>1) next_scale=1;
						if(afterNext_scale>0.88) afterNext_scale=0.88;

						if(dist<0){
							$curDom.css({
								"-webkit-transform":"translateX("+dist+"px) scale("+cur_scale+")",
								"transform":"translateX("+dist+"px) scale("+cur_scale+")"
							});

							$prevDom.css({
								"-webkit-transform":"translateX("+dist+"px) scale("+prev_scale+")",
								"transform":"translateX("+dist+"px) scale("+prev_scale+")"
							});

							$nextDom.css({
								"-webkit-transform":"translateX("+dist+"px) scale("+next_scale+")",
								"transform":"translateX("+dist+"px) scale("+next_scale+")"
							});

							if($curDom.offset().left<10){
								$afterNextDom.css({
									"-webkit-transform":"translateX("+dist+"px) scale("+afterNext_scale+")",
									"transform":"translateX("+dist+"px) scale("+afterNext_scale+")"
								});
							}
						}
					}
				},
				move:function(e){
					e.preventDefault();

					var touch=e.touches[0];

					delta={
						x:touch.pageX-start.x,
						y:touch.pageY-start.y
					}

					requestAnimation(function(){
						Events.translate(delta.x);
					});
				},
				end:function(e){
					e.preventDefault();

					requestAnimation(function(){
						Events.translate(-185);
						curIndex=curIndex+1 > maxIndex? 0 : curIndex+1;
						_updateIndex();
					});

					$ul[0].removeEventListener("touchmove",Events.move,false);
					$ul[0].removeEventListener("touchend",Events.end,false);
				}
			}

			$ul.on("touchstart",Events.start)
	})();
});