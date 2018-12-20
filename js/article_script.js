
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
function isElementPartiallyInViewport (el) {
	var rect = getBound(el);
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.bottom >= 0 
	);
}
function isElementAboveBottomOfViewport (el) {
	var rect = getBound(el);
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight)
	);
}
function isElementUnderBottomOfViewport (el) {
	var rect = getBound(el);
	return (
		rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)
	);
}

function onUnderBottomOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최하단보다 아래쪽으로 살짝만 뻗어나오면/완전히 최하단 위쪽으로 올라가버리면, 발동.
	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
	return function () {
		var cover = isElementUnderBottomOfViewport(el);
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

function onAboveBottomOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최하단보다 위쪽으로 살짝만 뻗어나오면/완전히 최하단 아래로 내려가버리면, 발동.
	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
	return function () {
		var cover = isElementAboveBottomOfViewport(el);
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


function onPartiallyCoverViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport의 일부를 가리는 순간/전혀 보이지 않는 순간, 발동.
	var old_cover=null; // 처음 onLoad할 때에 무조건 발동되게 함.
	return function () {
		var cover = isElementPartiallyInViewport(el);
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

function triggerFunction(_el, _callback) {
	return onFULLYcoverViewport( _el,  
		function() { // callback_fullyCover
			_callback();
			$(window).on('resize scroll', _callback); 
		}, 
		function() { // callback_notFullyCover
			$(window).off('resize scroll', _callback); 
		}
	);
}



var handler_chapter_01 = onPartiallyCoverViewport( $("#chapter-01"), 
													function() {
														$(".fixed-background").removeClass("visible");
														$("#chapter-01-map").addClass("visible");
														$("#layer-names").removeClass("visible");
														console.log("chapter-01");
													}, 
													function() {}
													);

var handler_chapter_02 = onPartiallyCoverViewport( $("#chapter-02"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-02-background").addClass("visible");
															$("#layer-names").addClass("visible");
															console.log("chapter-02");
														}, 
														function() {}
														);

function scrollFunction_chapter_03() {
	var mapSvgBound = layer_province_border_03.getBounds();
	var mapSvgNW = map_03.latLngToContainerPoint(mapSvgBound.getNorthWest());
	var mapSvgSE = map_03.latLngToContainerPoint(mapSvgBound.getSouthEast());
	var mapSvgWidth = mapSvgSE.x - mapSvgNW.x;
	var mapSvgLeft = mapSvgNW.x;
	var mapSvgTop = mapSvgNW.y;
	$("#chapter-03-svg").width( mapSvgWidth ).css( { top: mapSvgTop+'px', left: mapSvgLeft+'px' } );

	$(".fixed-background").removeClass("visible");
	$("#chapter-03-background").addClass("visible");
	$("#layer-names").addClass("visible");
	$("#layer-names div").removeClass('orange-background').addClass('red-background');

	console.log("chapter-03");
}
var handler_chapter_03 = onPartiallyCoverViewport( $("#chapter-03"), scrollFunction_chapter_03, function() {} );



//jQuery
$(window).on('DOMContentLoaded load resize scroll', handler_chapter_01)
			.on('DOMContentLoaded load resize scroll', handler_chapter_02)
			.on('DOMContentLoaded load resize scroll', handler_chapter_03);
