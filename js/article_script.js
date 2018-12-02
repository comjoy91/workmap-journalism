
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

function onUnderBottomOfViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover=true; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
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

function onAboveBottomOfViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
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


function onPartiallyCoverViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport 전체를 가리는/가리지 않는 순간, 발동.
	var old_cover; // initial value = false: 맨 처음(onLoad) 시점에서 viewport에 보이지 않으면, callback이 없도록 함.
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
														console.log("chapter-01");
													}, 
													function() {}
												);

var handler_chapter_02_opacity = onPartiallyCoverViewport( $("#chapter-02"), 
															function() {
																$(".fixed-background").removeClass("visible");
																$("#chapter-02-svgs-landscape").addClass("visible");
																console.log("chapter-02-opacity")
															}, 
															function() {
																console.log("chapter-02-opacity-1")
															});

var handler_chapter_03 = onPartiallyCoverViewport( $("#chapter-03"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-03-svgs").addClass("visible");
															console.log("chapter-03-chapter");
														}, 
														function() {}
														);
$("#chapter-03 div.page").each( function(index) {

	var movingLayer_03 = function() {

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

	}
	$(window).on('DOMContentLoaded load resize scroll', movingLayer_03); // load 시점에 모든 $("#chapter-03 div.page")에 대해서 트리거가 일어남.

	var changeLayer_03 = function() {
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
	$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( $(this), changeLayer_03, function() {} )); // 트리거가 일시적으로 작동 
	$(window).on('scroll', onUnderBottomOfViewport( $(this), changeLayer_03, function(){} ));
})


function scrollFunction_chapter_04() {
	var mapSvgBound = layer_province_border_04.getBounds();
	var mapSvgNW = map_04.latLngToLayerPoint(mapSvgBound.getNorthWest());
	var mapSvgSE = map_04.latLngToLayerPoint(mapSvgBound.getSouthEast());
	var mapSvgWidth = mapSvgSE.x - mapSvgNW.x;
	var mapSvgLeft = mapSvgNW.x;
	var mapSvgTop = mapSvgNW.y;
	$("#chapter-04-svg").width( mapSvgWidth ).css( { top: mapSvgTop+'px', left: mapSvgLeft+'px' } );

	$(".fixed-background").removeClass("visible");
	$("#chapter-04-background").addClass("visible");

	console.log("chapter-04");
}
var handler_chapter_04 = onPartiallyCoverViewport( $("#chapter-04"), scrollFunction_chapter_04, function() {} );



// $("#chapter-04 div.page").each( function(index) {
// 	var changeLayer_04 = function() {
// 		var colorMunicipal = [ $("#chapter-04-svg g#02-8_expertRate_geographic #Gokseong"), 
// 								$("#chapter-04-svg g#02-8_expertRate_geographic #Ulsan_dong, #chapter-04-svg g#02-8_expertRate_geographic #Ulsan_buk"), 
// 								$("#chapter-04-svg g#02-8_expertRate_geographic #Gunsan"), 
// 								$("#chapter-04-svg g#02-8_expertRate_geographic #Suwon"), 
// 								$("#chapter-04-svg g#02-8_expertRate_geographic #Paju"), 
// 								$("#chapter-04-svg g#02-8_expertRate_geographic .municipalShape") ];
// 		$("#chapter-04-svg g#02-8_expertRate_geographic .municipalShape").not(colorMunicipal[index]).addClass("transparent_shape");
// 		colorMunicipal[index].removeClass("transparent_shape");
// 		console.log("chapter-04-pageChange-0"+index);
// 	}
// 	$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( $(this), changeLayer_04, function() {} )); // 트리거가 일시적으로 작동 
// 	$(window).on('scroll', onUnderBottomOfViewport( $(this), changeLayer_04, function(){} ));
// })
// $(window).on('load', function() {
// 	$("#chapter-04 div.page").each( function(index) {
// 		var changeLayer_04 = function() {
// 			var svgDocument = document.getElementById("chapter-04-svg").contentDocument;
// 			var municipals = svgDocument.getElementById("02-8_expertRate_geographic").getElementsByClassName("municipalShape");
// 			var colorMunicipal = [ [svgDocument.getElementById("Goksung")], 
// 									[svgDocument.getElementById("Ulsan_dong"), svgDocument.getElementById("Ulsan_buk")], 
// 									[svgDocument.getElementById("Gunsan")], 
// 									[svgDocument.getElementById("Suwon")], 
// 									[svgDocument.getElementById("Paju")], 
// 									municipals ];

// 			for (shape in municipals) {		
// 				if (shape.classList)
// 					shape.classList.add('transparent_shape');
// 				else
// 					shape.className += ' ' + 'transparent_shape';
// 			}
// 			for (shapeArray in colorMunicipal) {
// 				for (shape in shapeArray) {
// 					if (shape.classList)
// 						shape.classList.remove('transparent_shape');
// 					else
// 						shape.className = shape.className.replace(new RegExp('(^|\\b)' + 'transparent_shape'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
// 				}
// 			}
// 			console.log("chapter-04-pageChange-0"+index);
// 		}
// 		$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( $(this), changeLayer_04, function() {} )); // 트리거가 일시적으로 작동 
// 		$(window).on('scroll', onUnderBottomOfViewport( $(this), changeLayer_04, function(){} ));
// 	})
// });

function scrollFunction_chapter_05() {
	// var svgDocument = document.getElementById("chapter-04-svg").contentDocument;

	// var municipals = svgDocument.getElementById("02-8_expertRate_geographic").getElementsByClassName("municipalShape");
	// for (shape in municipals) {
	// 	shape.setAttribute("fill-opacity", 0.0);
	// 	shape.setAttribute("stroke-opadity", 0.0);
	// }

	// var colorMunicipal = [ [svgDocument.getElementById("Goksung")], 
	// 						[svgDocument.getElementById("Ulsan_dong"), svgDocument.getElementById("Ulsan_buk")], 
	// 						[svgDocument.getElementById("Gunsan")], 
	// 						[svgDocument.getElementById("Suwon")], 
	// 						[svgDocument.getElementById("Paju")] ];
	// for (shapeArray in colorMunicipal) {
	// 	for (shape in shapeArray) {
	// 		shape.setAttribute("fill-opacity", 0.7);
	// 		shape.setAttribute("stroke-opadity", 0.15);
	// 	}
	// }


	// var colorMunicipal = [ [svgDocument.getElementById("Goksung")], 
	// 						[svgDocument.getElementById("Ulsan_dong"), svgDocument.getElementById("Ulsan_buk")], 
	// 						[svgDocument.getElementById("Gunsan")], 
	// 						[svgDocument.getElementById("Suwon")], 
	// 						[svgDocument.getElementById("Paju")] ];
}
//jQuery
$(window).on('DOMContentLoaded load resize scroll', handler_chapter_01)
			.on('DOMContentLoaded load resize scroll', handler_chapter_02_opacity)
			.on('DOMContentLoaded load resize scroll', handler_chapter_03)
			.on('DOMContentLoaded load resize scroll', handler_chapter_04);