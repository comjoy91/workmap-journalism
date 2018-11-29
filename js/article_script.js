
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

function isElementReachedTopViewport (el) {
	var rect = getBound(el);
	return (
		rect.top <= 0 && rect.bottom >= 0 
	);
}

function isElementAVOBEBottomViewport (el) {
	var rect = getBound(el);
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight)
	);
}

// function onReachedTopChange(el, callback) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
// 	var old_visible = false; // initial value = false. 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
// 	return function () {
// 		var visible = isElementReachedTopViewport(el);
// 		if (visible != old_visible) {
// 			old_visible = visible;
// 			if (typeof callback == 'function') {
// 				callback();
// 			}
// 		}
// 	}
// }


function onAVOBEBottomViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
	return function () {
		var cover = isElementAVOBEBottomViewport(el);
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


function onPARTIALLYcoverViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
	return function () {
		var cover = isElementPARTIALLYInViewport(el);
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
function triggerFunction_3(_el, _callback) {
	return onPARTIALLYcoverViewport( _el,  
		function() { // callback_fullyCover
			_callback();
			$(window).on('resize scroll', _callback); 
		}, 
		function() { // callback_notFullyCover
			$(window).off('resize scroll', _callback); 
		}
	);
}


function onReachedTopChange(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
	return function () {
		var cover = isElementReachedTopViewport(el);
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

function triggerFunction_2(_el, _callback) {
	return onReachedTopChange( _el,  
		function() { // callback_fullyCover
			_callback();
			$(window).on('resize scroll', _callback); 
		}, 
		function() { // callback_notFullyCover
			$(window).off('resize scroll', _callback); 
		}
	);
}




function onFULLYcoverViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
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


// function scrollFunction_chapter_02() {
// 	var svgBound = getBound($("#chapter-01-map .leaflet-overlay-pane svg g"));
// 	var objectWidth_original = svgBound.width * modified_mapWidth_const;
// 	var objectHeight_original = svgBound.height;

// 	var chapter02_bound = getBound( $("#chapter-02") );
// 	var chapter02_top = chapter02_bound.top;
// 	var chapter02_height = chapter02_bound.height;
// 	var scrollRatio = ( 1 - (chapter02_top / $(window).height()) ) * 3;
// 	if ( scrollRatio > 1 ) scrollRatio = 1;
// 	else if (scrollRatio < 0 ) scrollRatio = 0;

// 	var widthBefore = objectWidth_original;
// 	var widthAfter = $(window).width() * 15/100;
// 	var objectWidth = widthAfter * scrollRatio + widthBefore * (1-scrollRatio);

// 	var heightBefore = objectHeight_original;
// 	var heightAfter = objectHeight_original * $(window).width() * 15/100 / objectWidth_original ;
// 	var objectHeight = heightAfter * scrollRatio + heightBefore * (1-scrollRatio);

// 	var marginBefore_B = -objectHeight_original;
// 	var marginAfter_B = 0;
// 	var margin_B = marginAfter_B * scrollRatio + marginBefore_B * (1-scrollRatio);

// 	var marginBefore_R = -objectWidth_original;
// 	var marginAfter_R = 0;
// 	var margin_R = marginAfter_R * scrollRatio + marginBefore_R * (1-scrollRatio);

// 	var boundingWidthBefore = 0;
// 	var boundingWidthAfter = $(window).width() * 90/100; //( objectWidth * scrollRatio ) * ($("#single-orange-maps object").length-1);
// 	var boundingWidth = boundingWidthAfter * scrollRatio + boundingWidthBefore * (1-scrollRatio);

// 	var boundingHeightBefore = 0;
// 	var boundingHeightAfter = $(window).height() * 90/100; //( objectWidth * scrollRatio ) * ($("#single-orange-maps object").length-1);
// 	var boundingHeight = boundingHeightAfter * scrollRatio + boundingHeightBefore * (1-scrollRatio);

// 	var boundingMarginAfter_T = $(window).height() * 5/100;
// 	var boundingMarginBefore_T = svgBound.top// + objectHeight_original/2;
// 	var boundingMargin_T = boundingMarginAfter_T * scrollRatio + boundingMarginBefore_T * (1-scrollRatio);

// 	var boundingMarginAfter_L = $(window).width() * 5/100;
// 	var boundingMarginBefore_L = svgBound.left + (modified_mapLeft_const * svgBound.width * modified_mapWidth_const / modified_mapWidth);
// 	var boundingMargin_L = boundingMarginAfter_L * scrollRatio + boundingMarginBefore_L * (1-scrollRatio);

// 	// $("#chapter-02-svgs-landscape .single-orange-maps-row").each( function(index) {
// 	// 	$(this).css( { width: boundingWidth, /* height: boundingHeight, top: boundingMargin_T,*/ left: boundingMargin_L } );
// 	// });
// 	// $("#chapter-02-svgs-landscape object").css( { 'margin-bottom': margin_B+'px', 'margin-right': margin_R+'px', width: objectWidth+'px', height: objectHeight+'px'  } );

// 	$("#chapter-02-svgs-landscape").width( boundingWidth )
// 										.height( boundingHeight )
// 										.css( { top: boundingMargin_T +'px', left: boundingMargin_L + 'px' });
// 	$(".single-orange-maps-row").width( boundingWidth )
// 								.height( objectHeight )
// 								.css( { 'margin-bottom': margin_B + 'px' });
// 	$(".single-orange-maps-row object").width( objectWidth )
// 										.height( objectHeight )
// 										.css( { 'margin-right': margin_R + 'px' } );


// 	$("#chapter-01-map").css("opacity", 1-scrollRatio );
// 	$("#chapter-02-svgs-landscape").css("opacity", scrollRatio );
// }
// var handler_chapter_02 = triggerFunction_3($("#chapter-02"), scrollFunction_chapter_02);

var handler_chapter_01 = onPARTIALLYcoverViewport( $("#chapter-01"), 
													function() {
														$(".fixed-background").removeClass("visible");
														$("#chapter-01-map").addClass("visible");
														console.log("chapter-01");
													}, 
													function() {
													}
												);




function scrollFunction_chapter_02_expand() {
	var svgBound = getBound($("#chapter-01-map .leaflet-overlay-pane svg g"));
	var objectWidth_original = svgBound.width * modified_mapWidth_const;
	var objectHeight_original = svgBound.height;

	var widthAfter = $(window).width() * 15/100;
	var heightAfter = objectHeight_original * $(window).width() * 15/100 / objectWidth_original ;
	var marginAfter_B = 0;
	var marginAfter_R = 0;

	var boundingWidthAfter = $(window).width() * 90/100; //( objectWidth * scrollRatio ) * ($("#single-orange-maps object").length-1);
	var boundingHeightAfter = $(window).height() * 90/100; //( objectWidth * scrollRatio ) * ($("#single-orange-maps object").length-1);
	var boundingMarginAfter_T = $(window).height() * 5/100;
	var boundingMarginAfter_L = $(window).width() * 5/100;

	// $("#chapter-02-svgs-landscape .single-orange-maps-row").each( function(index) {
	// 	$(this).css( { width: boundingWidth, /* height: boundingHeight, top: boundingMargin_T,*/ left: boundingMargin_L } );
	// });
	// $("#chapter-02-svgs-landscape object").css( { 'margin-bottom': margin_B+'px', 'margin-right': margin_R+'px', width: objectWidth+'px', height: objectHeight+'px'  } );

	// $(".fixed-background").removeClass("visible");
	$("#chapter-02-svgs-landscape").css( { width: boundingWidthAfter, 
											height: boundingHeightAfter, 
											top: boundingMarginAfter_T +'px', 
											left: boundingMarginAfter_L + 'px' })//.addClass("visible");
	$(".single-orange-maps-row").css( { width: boundingWidthAfter, 
										// height: heightAfter, 
										'margin-bottom': marginAfter_B + 'px' });
	$(".single-orange-maps-row object").css( { width: widthAfter, 
												// heigth: heightAfter, 
												'margin-right': marginAfter_R + 'px' } );
	console.log("chapter-02-expand")
}

function scrollFunction_chapter_02_shrink() {
	var svgBound = getBound($("#chapter-01-map .leaflet-overlay-pane svg g"));
	var objectWidth_original = svgBound.width * modified_mapWidth_const;
	var objectHeight_original = svgBound.height;

	var widthBefore = objectWidth_original;
	var heightBefore = objectHeight_original;
	var marginBefore_B = -objectHeight_original;
	var marginBefore_R = -objectWidth_original;

	var boundingWidthBefore = 0;
	var boundingHeightBefore = 0;
	var boundingMarginBefore_T = svgBound.top// + objectHeight_original/2;
	var boundingMarginBefore_L = svgBound.left + (modified_mapLeft_const * svgBound.width * modified_mapWidth_const / modified_mapWidth);

	// $("#chapter-02-svgs-landscape .single-orange-maps-row").each( function(index) {
	// 	$(this).css( { width: boundingWidth, /* height: boundingHeight, top: boundingMargin_T,*/ left: boundingMargin_L } );
	// });
	// $("#chapter-02-svgs-landscape object").css( { 'margin-bottom': margin_B+'px', 'margin-right': margin_R+'px', width: objectWidth+'px', height: objectHeight+'px'  } );

	$("#chapter-02-svgs-landscape").css( { width: boundingWidthBefore, 
											height: boundingHeightBefore, 
											top: boundingMarginBefore_T +'px', 
											left: boundingMarginBefore_L + 'px' });
	$(".single-orange-maps-row").css( { width: boundingWidthBefore, 
										// height: heightBefore, 
										'margin-bottom': marginBefore_B + 'px' });
	$(".single-orange-maps-row object").css( { width: widthBefore, 
												// heigth: heightBefore, 
												'margin-right': marginBefore_R + 'px' } );
	console.log("chapter-02-shrink");
}
var handler_chapter_02_expand = onAVOBEBottomViewport( $("#chapter-02"), scrollFunction_chapter_02_expand, scrollFunction_chapter_02_shrink );
var handler_chapter_02_opacity = onPARTIALLYcoverViewport( $("#chapter-02"), 
															function() {
																$(".fixed-background").removeClass("visible");
																$("#chapter-02-svgs-landscape").addClass("visible");
																console.log("chapter-02-opacity")
															}, 
															function() {
																console.log("chapter-02-opacity-1")
															});

var handler_chapter_03 = onPARTIALLYcoverViewport( $("#chapter-03"), 
												function() {
													$(".fixed-background").removeClass("visible");
													$("#chapter-03-svgs").addClass("visible");
													console.log("chapter-03-chapter");
												}, 
												function() {
												});


$("#chapter-03 div.page").each( function(index) {

	var movingLayer = function() {

		var destinationBound = getBound($(".cumulative-red-maps object"));

		var layerMoving_bound = getBound( $("#chapter-03 div.layerMoving-div").eq(index) );
		var layerMoving_top = layerMoving_bound.top;
		var layerMoving_height = layerMoving_bound.height;
		var scrollRatio = -layerMoving_top / layerMoving_bound.height;
		if ( scrollRatio > 1 ) scrollRatio = 1;
		else if (scrollRatio < 0 ) scrollRatio = 0;

		var marginBefore_L = 0;
		var marginAfter_L = destinationBound.left - $(window).width() * 10/100;
		var margin_L = marginAfter_L * scrollRatio + marginBefore_L * (1-scrollRatio);

		$("#chapter-03-svgs .single-orange-maps object").eq(index).css( { left: margin_L+'px' } );
		console.log("chapter-03-pageMoving-0"+index);

	}
	$(window).on('DOMContentLoaded load', movingLayer); // load 시점에 모든 $("#chapter-03 div.page")에 대해서 트리거가 일어남.
	$(window).on('resize scroll', triggerFunction_2( $(this), movingLayer )); // 트리거가 연속적으로 작동

	var changeLayer = function() {
		$("#chapter-03-svgs .single-orange-maps object").not( $("#chapter-03-svgs .single-orange-maps object").eq(index) )
														.animate({ opacity: 0.0 }, 300,'easeInCubic');
		$("#chapter-03-svgs .cumulative-red-maps object").not( $("#chapter-03-svgs .cumulative-red-maps object").eq(index) )
														.animate({ opacity: 0.0 }, 300,'easeInCubic');
		$("#chapter-03-svgs .single-orange-maps object").eq(index)
														.animate({ opacity: 1.0 }, 300,'linear');
		$("#chapter-03-svgs .cumulative-red-maps object").eq(index)
														.animate({ opacity: 1.0 }, 300,'linear');
		console.log("chapter-03-pageChange-0"+index);
	}
	$(window).on('DOMContentLoaded load resize scroll', onPARTIALLYcoverViewport( $(this), changeLayer, function() {} )); // 트리거가 일시적으로 작동 
})


function scrollFunction_chapter_04() {
	var svgBound_04 = getBound($("#chapter-04-map .leaflet-overlay-pane svg g"));
	$("#chapter-04-svg").width( svgBound_04.width ).css( { top: svgBound_04.top+'px', left: svgBound_04.left+'px' } );

	$(".fixed-background").removeClass("visible");
	$("#chapter-04-background").addClass("visible");
	console.log("chapter-04");
}

var handler_chapter_04 = onPARTIALLYcoverViewport( $("#chapter-04"), scrollFunction_chapter_04, function() {} );



//jQuery
$(window).on('DOMContentLoaded load resize scroll', handler_chapter_01)
			.on('DOMContentLoaded load resize scroll', handler_chapter_02_expand)
			.on('DOMContentLoaded load resize scroll', handler_chapter_02_opacity)
			.on('DOMContentLoaded load resize scroll', handler_chapter_03)
			.on('DOMContentLoaded load resize scroll', handler_chapter_04); 