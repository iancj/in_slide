$(function(){
	;(function(){
		var $slide=$("#j-in-slide"),
			$ul=$slide.find(".in-slide-list"),
			$li=$slide.find("li"),
			li_width=$li[0].offsetWidth,
			li_height=$li[0].offsetHeight,
			li_size=$li.length,
			win_height=$(window).height(),
			win_width=$(window).width();

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

		var maxCurScale=1,
			maxPrevScale=0.8,
			maxNextScale=0.8,
			maxBeforePrevScale=0.6,
			maxAfterNextScale=0.6;

		var requestAnimation=window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.msRequestAnimationFrame;

		function _setup(){
			_updateDomPos();

			var whiteList=[curIndex,prevIndex,nextIndex,beforePrevIndex,afterNextIndex];

			$li.each(function(index,item){
				if(whiteList.indexOf(index)<0){
					var diffIndex=index-curIndex;
					_setPos($(item),diffIndex*li_width,maxAfterNextScale,false);
				}
			});
		}

		function _setPos(dom,dist,scale,enableTransition){
			dom.css({
				"-webkit-transform":"translateX("+dist+"px) scale("+scale+")",
				"transform":"translateX("+dist+"px) scale("+scale+")",
				"-webkit-transition":(enableTransition ? "all 0.2s linear" : "none"),
				"transition":(enableTransition ? "all 0.2s linear" : "none")
			});
		}

		function _updateDomPos(enableTransition){
			prevIndex=(curIndex-1)<0 ? maxIndex : curIndex-1,
			nextIndex=(curIndex+1)>maxIndex ? maxIndex : curIndex+1,
			beforePrevIndex=(prevIndex-1)<0 ? maxIndex : prevIndex-1,
			afterNextIndex=(nextIndex+1)>maxIndex ? maxIndex : nextIndex+1;

			$curDom=$li.eq(curIndex);
			$prevDom=$li.eq(prevIndex);
			$nextDom=$li.eq(nextIndex);
			$beforePrevDom=$li.eq(beforePrevIndex);
			$afterNextDom=$li.eq(afterNextIndex);

			_setPos($curDom,0,maxCurScale,enableTransition);
			_setPos($prevDom,-li_width,maxPrevScale,enableTransition);
			_setPos($nextDom,li_width,maxNextScale,enableTransition);
			_setPos($beforePrevDom,-li_width*2,maxBeforePrevScale,enableTransition);
			_setPos($afterNextDom,li_width*2,maxAfterNextScale,enableTransition);

			// console.log(beforePrevIndex,prevIndex,curIndex,nextIndex,afterNextIndex)
		}

		_setup();

		var Events={
			start:function(e){
				e.preventDefault();

				var touch=e.touches[0];

				start={
					x:touch.pageX,
					y:touch.pageY,
					timeStamp:e.timeStamp
				}

				_updateDomPos();

				$slide[0].addEventListener("touchmove",Events.move,false);
				$slide[0].addEventListener("touchend",Events.end,false);
			},
			translate:function(enableTransition){
				enableTransition=!!enableTransition;

				var dist=delta.x;

				if(Math.abs(dist)>li_width) dist=dist>0 ? dist=li_width : dist=-li_width;

				if(dist<0){
					var ratio=Math.abs(dist/win_width);

					var cur_scale=maxCurScale-ratio,
						prev_scale=maxPrevScale-maxPrevScale*ratio,
						next_scale=maxNextScale+ratio,
						afterNext_scale=maxAfterNextScale+maxNextScale*ratio;

					if(cur_scale<maxPrevScale) cur_scale=maxPrevScale;
					if(prev_scale<maxBeforePrevScale) prev_scale=maxBeforePrevScale;
					if(next_scale>maxCurScale) next_scale=maxCurScale;
					if(afterNext_scale>maxNextScale) afterNext_scale=maxNextScale;

					if(dist<0){
						_setPos($curDom,dist,cur_scale,enableTransition);
						_setPos($prevDom,-li_width+dist,prev_scale,enableTransition);
						_setPos($nextDom,li_width+dist,next_scale,enableTransition);
						_setPos($afterNextDom,li_width*2+dist,afterNext_scale,enableTransition);
					}
					else{
						// console.log("right")
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

				requestAnimation(Events.translate);
			},
			end:function(e){
				e.preventDefault();

				if((e.timeStamp-start.timeStamp)>200){
					if(delta.x<0 && Math.abs(delta.x)>=li_width/2){
						curIndex=curIndex+1 > maxIndex? 0 : curIndex+1;
					}
				}
				else{
					if(delta.x<-10){
						curIndex=curIndex+1 > maxIndex? 0 : curIndex+1;
					}
				}

				_updateDomPos(true);

				$ul[0].removeEventListener("touchmove",Events.move,false);
				$ul[0].removeEventListener("touchend",Events.end,false);
			}
		}

		$slide[0].addEventListener("touchstart",Events.start,false);
	})();
});