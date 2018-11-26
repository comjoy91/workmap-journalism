
/* ------------ detecting if a div is FULLY visible in viewport ------------ */


function isElementFULLYInViewport (el) {

	var rect = getBound(el);
	return (
		rect.top >= 0 &&
		// rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) // && /*or $(window).height() */
		// rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	);
}

function isElementPARTIALLYInViewport (el) {

	var rect = getBound(el);
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.bottom >= 0 
	);
}

function isElementCOVEReNTIREViewport (el) {

	var rect = getBound(el);
	return (
		rect.top <= 0 && 
		rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */
	);
}

// function onVisibilityChange(el, callback) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
// 	var old_visible = false; // initial value = false. 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
// 	return function () {
// 		var visible = isElementCOVEReNTIREViewport(el);
// 		if (visible != old_visible) {
// 			old_visible = visible;
// 			if (typeof callback == 'function') {
// 				callback();
// 			}
// 		}
// 	}
// }

function onFULLYcoverViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false. 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
	return function () {
		var cover = isElementCOVEReNTIREViewport(el);
		if (cover != old_cover) {
			old_cover = cover;
			if (cover && typeof callback_fullyCover == 'function') {
				callback_fullyCover();
			}
			else if (!cover && typeof callback_notFullyCover == 'function') {
				callback_notFullyCover();
			}
		}
	}
}


function scrollSVGs() {
	var chapter02_top = getBound( $("#chapter-02") ).top;
	var svgWidth_original = getBound($("#chapter-01-map .leaflet-overlay-pane svg g")).width;
	var scrollRatio = -chapter02_top / getBound( $("#chapter-02") ).height * 2;
	if ( scrollRatio > 1 ) scrollRatio = 1;
	else if (scrollRatio < 0 ) scrollRatio = 0;

	var maxLeft = getBound($("#chapter-01-map .leaflet-overlay-pane svg g")).left;
	var minLeft = maxLeft - ( maxLeft * scrollRatio * 2);
	var scrollLeftIndex = (maxLeft - minLeft) / ($("#single-orange-maps object").length+1);
	var scrollLeft;
	var maxWidth = svgWidth_original;
	var minWidth = maxWidth / 3;
	var scrollWidth = maxWidth + (minWidth - maxWidth) * scrollRatio;
	$("#single-orange-maps object").each( function(index) {
		scrollLeft = minLeft + scrollLeftIndex * index;
		$(this).css( { left: scrollLeft+'px', width: scrollWidth+'px' } );
	});

	$("#chapter-01-map").css("opacity",(1-scrollRatio)/2);
}

// var handler = onVisibilityChange(el, function() {
//      your code go here 
//     console.log("viewport");
// });

var handler_chapter_02 = onFULLYcoverViewport($("#chapter-02"), 
	function() { // callback_fullyCover
	/* your code go here */
		$(window).on('resize scroll', scrollSVGs); 

	}, 
	function() { // callback_notFullyCover
		$(window).off('resize scroll', scrollSVGs); 
	}
);

//jQuery
$(window).on('DOMContentLoaded load resize scroll', handler_chapter_02); 