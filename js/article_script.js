// ---------- function for getting "getBoundingClientRect()"
function getBound (el) {

	//special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	return el.getBoundingClientRect();
};





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
// function isElementAboveTopOfViewport (el) {
// 	var rect = getBound(el);
// 	return (
// 		rect.top <= 0
// 	);
// }
// function isElementUnderTopOfViewport (el) {
// 	var rect = getBound(el);
// 	return (
// 		rect.bottom >= 0
// 	);
// }
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

// function onUnderTopOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최상단보다 아래쪽으로 살짝만 뻗어나오면/완전히 최상단 위쪽으로 올라가버리면, 발동.
// 	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
// 	return function () {
// 		var cover = isElementUnderTopOfViewport(el);
// 		if (cover != old_cover) {
// 			old_cover = cover;
// 			if (cover && typeof callback_fullyCover == 'function') {
// 				callback_fullyCover();
// 			}
// 			else if (!cover && typeof callback_notFullyCover == 'function') {
// 				callback_notFullyCover();
// 			}
// 		}
// 	}
// }

// function onAboveTopOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최상단보다 위쪽으로 살짝만 뻗어나오면/완전히 최상단 아래로 내려가버리면, 발동.
// 	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
// 	return function () {
// 		var cover = isElementAboveTopOfViewport(el);
// 		if (cover != old_cover) {
// 			old_cover = cover;
// 			if (cover && typeof callback_fullyCover == 'function') {
// 				callback_fullyCover();
// 			}
// 			else if (!cover && typeof callback_notFullyCover == 'function') {
// 				callback_notFullyCover();
// 			}
// 		}
// 	}
// }

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

function onAboveBottomOfViewport_initial(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최하단보다 위쪽으로 살짝만 뻗어나오면/완전히 최하단 아래로 내려가버리면, 발동.
	var old_cover; // 처음 onLoad할 때에도 무조건 callback이 일어나게 함.
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




// (function() {

// 	window.addEventListener("resize", resizeThrottler, false);

// 	var resizeTimeout;
// 	function resizeThrottler() {
// 		// ignore resize events as long as an actualResizeHandler execution is in the queue
// 		if ( !resizeTimeout ) {
// 			resizeTimeout = setTimeout(function() {
// 				resizeTimeout = null;
// 				actualResizeHandler();

// 			// The actualResizeHandler will execute at a rate of 15fps
// 		}, 66);
//     }
// }

// function actualResizeHandler() {
//     // handle the resize event
//     ...
// }

// }());




var handler_chapter_01 = onAboveBottomOfViewport_initial( $("#chapter-01"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-01-background").addClass("visible");
															$("#layer-names").removeClass("visible");
															console.log("chapter-01");
														}, 
														function() {}
													);

var handler_chapter_02 = onAboveBottomOfViewport_initial( $("#chapter-02"),  
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-02-background").addClass("visible");
															$("#layer-names").addClass("visible");
															console.log("chapter-02");
														}, 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-01-background").addClass("visible");
															$("#layer-names").removeClass("visible");
															console.log("chapter-01");
														}
												);

var handler_chapter_03 = onAboveBottomOfViewport_initial( $("#chapter-03"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-03-background").addClass("visible");
															$("#layer-names").removeClass("visible");
															$("#layer-names div").removeClass('orange-background').addClass('red-background');
															console.log("chapter-03");
														}, 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-02-background").addClass("visible");
															$("#layer-names").addClass("visible");
															console.log("chapter-02");
														}
													);


function resizeMap_chapter_01_03() {

	var mapSvgBound_01 = layer_province_border_01.getBounds();
	var mapSvgNW_01 = map_01.latLngToContainerPoint(mapSvgBound_01.getNorthWest());
	var mapSvgSE_01 = map_01.latLngToContainerPoint(mapSvgBound_01.getSouthEast());
	var mapSvgWidth_01 = mapSvgSE_01.x - mapSvgNW_01.x;
	var mapSvgLeft_01 = mapSvgNW_01.x;
	var mapSvgTop_01 = mapSvgNW_01.y;
	$("#chapter-01-svg").width( mapSvgWidth_01 ).css( { top: mapSvgTop_01+'px', left: mapSvgLeft_01+'px' } );

	var mapSvgBound_03 = layer_province_border_03.getBounds();
	var mapSvgNW_03 = map_03.latLngToContainerPoint(mapSvgBound_03.getNorthWest());
	var mapSvgSE_03 = map_03.latLngToContainerPoint(mapSvgBound_03.getSouthEast());
	var mapSvgWidth_03 = mapSvgSE_03.x - mapSvgNW_03.x;
	var mapSvgLeft_03 = mapSvgNW_03.x;
	var mapSvgTop_03 = mapSvgNW_03.y;
	$("#chapter-03-svg").width( mapSvgWidth_03 ).css( { top: mapSvgTop_03+'px', left: mapSvgLeft_03+'px' } );	
}




//jQuery
$(window).on('DOMContentLoaded load orientationchange resize scroll', handler_chapter_01)
			.on('DOMContentLoaded load orientationchange resize scroll', handler_chapter_02)
			.on('DOMContentLoaded load orientationchange resize scroll', handler_chapter_03)
			.on('DOMContentLoaded load orientationchange resize', resizeMap_chapter_01_03);
