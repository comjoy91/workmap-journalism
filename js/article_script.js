
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
// $("#chapter-03 div.page").each( function(index) {

// 	var movingLayer_03 = function() {

// 		var destinationBound = getBound($(".cumulative-red-maps object"));

// 		var layerMoving_bound = getBound( $("#chapter-03 div.layerMoving-div").eq(index) );
// 		var layerMoving_top = layerMoving_bound.top;
// 		var layerMoving_height = layerMoving_bound.height;
// 		var scrollRatio = -layerMoving_top / layerMoving_bound.height;
// 		if ( scrollRatio > 1 ) scrollRatio = 1;
// 		else if (scrollRatio < 0 ) scrollRatio = 0;

// 		var marginBefore_L = 0;
// 		var marginAfter_L = destinationBound.left - $(window).width() * 15/100;
// 		var margin_L = marginAfter_L * scrollRatio + marginBefore_L * (1-scrollRatio);

// 		$("#chapter-03-svgs .single-orange-maps object").eq(index).css( { left: margin_L+'px' } );

// 	}
// 	// $(window).on('DOMContentLoaded load resize scroll', movingLayer_03); // load 시점에 모든 $("#chapter-03 div.page")에 대해서 트리거가 일어남.

// 	var changeLayer_03 = function() {
// 		$("#chapter-03-svgs .single-orange-maps object").not( $("#chapter-03-svgs .single-orange-maps object").eq(index) )
// 														.animate({ opacity: 0.0 }, 300,'easeInCubic');
// 		$("#chapter-03-svgs .cumulative-red-maps object").not( $("#chapter-03-svgs .cumulative-red-maps object").eq(index) )
// 														.animate({ opacity: 0.0 }, 300,'easeInCubic');
// 		$("#chapter-03-svgs .single-orange-maps object").eq(index)
// 														.animate({ opacity: 1.0 }, 300,'linear');
// 		$("#chapter-03-svgs .cumulative-red-maps object").eq(index)
// 														.animate({ opacity: 1.0 }, 300,'linear');
// 		$("#layer-names div").eq(index).removeClass('orange-background').addClass('red-background');
// 		$("#layer-names div").eq(index+1).removeClass('red-background').addClass('orange-background');
// 		$("#layer-names div").eq(index+2).removeClass('orange-background');
// 		console.log("chapter-03-pageChange-0"+index);
// 	}
// 	$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( $(this), changeLayer_03, function() {} )); // 트리거가 일시적으로 작동 
// 	$(window).on('scroll', onUnderBottomOfViewport( $(this), changeLayer_03, function(){} ));
// })


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






// --------------- CSS transition while scrolling --------------

// var orangeLayer = [ // $("#chapter-02-svg-orange g#01-1_hiring300"), 
// 					$("#chapter-02-svg-orange g#01-2_hiring1000"), 
// 					$("#chapter-02-svg-orange g#01-3_mainIndustry"), 
// 					$("#chapter-02-svg-orange g#01-4_20s"), 
// 					$("#chapter-02-svg-orange g#01-5_jobCreation"), 
// 					$("#chapter-02-svg-orange g#01-6_incomeRate"), 
// 					$("#chapter-02-svg-orange g#01-7_R-COSTII"), 
// 					$("#chapter-02-svg-orange g#01-8_expertRate") ];
					
// var redLayer = [ $("#chapter-02-svg-red g#02-1_hiring300"), 
// 					$("#chapter-02-svg-red g#02-2_hiring1000"), 
// 					$("#chapter-02-svg-red g#02-3_mainIndustry"), 
// 					$("#chapter-02-svg-red g#02-4_20s"), 
// 					$("#chapter-02-svg-red g#02-5_jobCreation"), 
// 					$("#chapter-02-svg-red g#02-6_incomeRate"), 
// 					$("#chapter-02-svg-red g#02-7_R-COSTII"), 
// 					$("#chapter-02-svg-red g#02-8_expertRate") ];

// var changeLayer_02_scrollToTop = function( _layerIndex ) {
// 	orangeLayer[_layerIndex].prevAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transform-toRight-shape transparent-shape"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});
// 	orangeLayer[_layerIndex].nextAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});

// 	redLayer[_layerIndex].prevAll("#chapter-02-svg-red g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});
// 	redLayer[_layerIndex].nextAll("#chapter-02-svg-red g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transparent-shape visibility-noDelay"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});

// 	redLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
// 		setTimeout( function() { 
// 			$(_ele).addClass("visibility-noDelay").removeClass("transparent-shape"); 
// 		}, _shapeIndex * 5 );
// 	});

// 	orangeLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
// 		setTimeout( function() { 
// 			$(_ele).addClass("visibility-noDelay").removeClass("transform-toRight-shape transparent-shape"); 
// 		}, _shapeIndex * 5 );
// 	});

// 	$("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[_layerIndex]).addClass("transparent-layer");
// 	$("#chapter-02-svg-red g.municipalLayer").not(redLayer[_layerIndex]).addClass("transparent-layer");
// 	orangeLayer[_layerIndex].removeClass("transparent-layer");
// 	redLayer[_layerIndex].removeClass("transparent-layer");

// 	$("#layer-names div").eq(_layerIndex).removeClass('orange-background').addClass('red-background');
// 	$("#layer-names div").eq(_layerIndex+1).removeClass('red-background').addClass('orange-background');
// 	$("#layer-names div").eq(_layerIndex+2).removeClass('orange-background');

// 	console.log("chapter-02-pageChange-0"+_layerIndex);
// };

// // var handler_changeLayer_02_scrollToTop = onUnderBottomOfViewport( chapter_02_thisPage, changeLayer_02_scrollToTop, function(){} )


// var changeLayer_02_scrollToBottom = function( _layerIndex ) {
// 	orangeLayer[_layerIndex].prevAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transform-toRight-shape transparent-shape").removeClass("visibility-noDelay"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});
// 	orangeLayer[_layerIndex].nextAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transparent-shape").removeClass("transform-toRight-shape"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});

// 	redLayer[_layerIndex].prevAll("#chapter-02-svg-red g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});
// 	redLayer[_layerIndex].nextAll("#chapter-02-svg-red g.municipalLayer").each( function() {
// 		$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
// 			setTimeout( function() { 
// 				$(_ele).addClass("transparent-shape visibility-noDelay"); 
// 			}, _shapeIndex * 5 );
// 		});
// 	});

// 	redLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
// 		setTimeout( function() { 
// 			$(_ele).removeClass("transparent-shape visibility-noDelay"); 
// 		}, _shapeIndex * 5 );
// 	});

// 	orangeLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
// 		setTimeout( function() { 
// 			$(_ele).removeClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
// 		}, _shapeIndex * 5 + 300);
// 	});


// 	$("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[_layerIndex]).addClass("transparent-layer");
// 	$("#chapter-02-svg-red g.municipalLayer").not(redLayer[_layerIndex]).addClass("transparent-layer");
// 	orangeLayer[_layerIndex].removeClass("transparent-layer");
// 	redLayer[_layerIndex].removeClass("transparent-layer");

// 	$("#layer-names div").eq(_layerIndex).removeClass('orange-background').addClass('red-background');
// 	$("#layer-names div").eq(_layerIndex+1).removeClass('red-background').addClass('orange-background');
// 	$("#layer-names div").eq(_layerIndex+2).removeClass('orange-background');

// 	console.log("chapter-02-pageChange-0"+_layerIndex);
// };





						
						// $("#chapter-02 div.page").each( function(index) { 

						// var chapter_02_thisPage = $("#chapter-02 div.page").eq(index);
						// 	var changeLayer_02_scrollToTop = function() {

						// var orangeLayer = [ // $("#chapter-02-svg-orange g#01-1_hiring300"), 
						// 					$("#chapter-02-svg-orange g#01-2_hiring1000"), 
						// 					$("#chapter-02-svg-orange g#01-3_mainIndustry"), 
						// 					$("#chapter-02-svg-orange g#01-4_20s"), 
						// 					$("#chapter-02-svg-orange g#01-5_jobCreation"), 
						// 					$("#chapter-02-svg-orange g#01-6_incomeRate"), 
						// 					$("#chapter-02-svg-orange g#01-7_R-COSTII"), 
						// 					$("#chapter-02-svg-orange g#01-8_expertRate") ];
											
						// var redLayer = [ $("#chapter-02-svg-red g#02-1_hiring300"), 
						// 					$("#chapter-02-svg-red g#02-2_hiring1000"), 
						// 					$("#chapter-02-svg-red g#02-3_mainIndustry"), 
						// 					$("#chapter-02-svg-red g#02-4_20s"), 
						// 					$("#chapter-02-svg-red g#02-5_jobCreation"), 
						// 					$("#chapter-02-svg-red g#02-6_incomeRate"), 
						// 					$("#chapter-02-svg-red g#02-7_R-COSTII"), 
						// 					$("#chapter-02-svg-red g#02-8_expertRate") ];


						// 		orangeLayer[index].prevAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transform-toRight-shape transparent-shape"); 
						// 				}, _index * 5 );
						// 			});
						// 		});
						// 		orangeLayer[index].nextAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
						// 				}, _index * 5 );
						// 			});
						// 		});

						// 		redLayer[index].prevAll("#chapter-02-svg-red g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
						// 				}, _index * 5 );
						// 			});
						// 		});
						// 		redLayer[index].nextAll("#chapter-02-svg-red g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transparent-shape visibility-noDelay"); 
						// 				}, _index * 5 );
						// 			});
						// 		});

						// 		redLayer[index].children(".active-shape").each( function( _index, _ele ) {
						// 			setTimeout( function() { 
						// 				$(_ele).addClass("visibility-noDelay").removeClass("transparent-shape"); 
						// 			}, _index * 5 );
						// 		});

						// 		orangeLayer[index].children(".active-shape").each( function( _index, _ele ) {
						// 			setTimeout( function() { 
						// 				$(_ele).addClass("visibility-noDelay").removeClass("transform-toRight-shape transparent-shape"); 
						// 			}, _index * 5 );
						// 		});

						// 		$("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[index]).addClass("transparent-layer");
						// 		$("#chapter-02-svg-red g.municipalLayer").not(redLayer[index]).addClass("transparent-layer");
						// 		orangeLayer[index].removeClass("transparent-layer");
						// 		redLayer[index].removeClass("transparent-layer");

						// 		$("#layer-names div").eq(index).removeClass('orange-background').addClass('red-background');
						// 		$("#layer-names div").eq(index+1).removeClass('red-background').addClass('orange-background');
						// 		$("#layer-names div").eq(index+2).removeClass('orange-background');

						// 		console.log("chapter-02-pageChange-0"+index);
						// 	}

						// 	var changeLayer_02_scrollToBottom = function() {


						// var orangeLayer = [ // $("#chapter-02-svg-orange g#01-1_hiring300"), 
						// 					$("#chapter-02-svg-orange g#01-2_hiring1000"), 
						// 					$("#chapter-02-svg-orange g#01-3_mainIndustry"), 
						// 					$("#chapter-02-svg-orange g#01-4_20s"), 
						// 					$("#chapter-02-svg-orange g#01-5_jobCreation"), 
						// 					$("#chapter-02-svg-orange g#01-6_incomeRate"), 
						// 					$("#chapter-02-svg-orange g#01-7_R-COSTII"), 
						// 					$("#chapter-02-svg-orange g#01-8_expertRate") ];
											
						// var redLayer = [ $("#chapter-02-svg-red g#02-1_hiring300"), 
						// 					$("#chapter-02-svg-red g#02-2_hiring1000"), 
						// 					$("#chapter-02-svg-red g#02-3_mainIndustry"), 
						// 					$("#chapter-02-svg-red g#02-4_20s"), 
						// 					$("#chapter-02-svg-red g#02-5_jobCreation"), 
						// 					$("#chapter-02-svg-red g#02-6_incomeRate"), 
						// 					$("#chapter-02-svg-red g#02-7_R-COSTII"), 
						// 					$("#chapter-02-svg-red g#02-8_expertRate") ];


						// 		// ORIGINAL!!

						// 		// $("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[index]).each( function() {
						// 		// 	$(this).children(".active-shape").each( function( _index, _ele ) {
						// 		// 		setTimeout( function() { 
						// 		// 			$(_ele).addClass("transform-toRight-shape transparent-shape"); 
						// 		// 		}, _index * 5 );
						// 		// 	});
						// 		// });
						// 		// $("#chapter-02-svg-red g.municipalLayer").not(redLayer[index]).each( function() {
						// 		// 	$(this).children(".active-shape").each( function( _index, _ele ) {
						// 		// 		setTimeout( function() { 
						// 		// 			$(_ele).addClass("transparent-shape"); 
						// 		// 		}, _index * 5 );
						// 		// 	});
						// 		// });

						// 		// redLayer[index].children(".active-shape").each( function( _index, _ele ) {
						// 		// 	setTimeout( function() { 
						// 		// 		$(_ele).removeClass("transparent-shape"); 
						// 		// 	}, _index * 5 );
						// 		// });

						// 		// orangeLayer[index].children(".active-shape").each( function( _index, _ele ) {
						// 		// 	setTimeout( function() { 
						// 		// 		$(_ele).removeClass("transform-toRight-shape transparent-shape"); 
						// 		// 	}, _index * 5 + 600);
						// 		// });




						// 		orangeLayer[index].prevAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transform-toRight-shape transparent-shape").removeClass("visibility-noDelay"); 
						// 				}, _index * 5 );
						// 			});
						// 		});
						// 		orangeLayer[index].nextAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transparent-shape").removeClass("transform-toRight-shape"); 
						// 				}, _index * 5 );
						// 			});
						// 		});

						// 		redLayer[index].prevAll("#chapter-02-svg-red g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
						// 				}, _index * 5 );
						// 			});
						// 		});
						// 		redLayer[index].nextAll("#chapter-02-svg-red g.municipalLayer").each( function() {
						// 			$(this).children(".active-shape").each( function( _index, _ele ) {
						// 				setTimeout( function() { 
						// 					$(_ele).addClass("transparent-shape visibility-noDelay"); 
						// 				}, _index * 5 );
						// 			});
						// 		});

						// 		redLayer[index].children(".active-shape").each( function( _index, _ele ) {
						// 			setTimeout( function() { 
						// 				$(_ele).removeClass("transparent-shape visibility-noDelay"); 
						// 			}, _index * 5 );
						// 		});

						// 		orangeLayer[index].children(".active-shape").each( function( _index, _ele ) {
						// 			setTimeout( function() { 
						// 				$(_ele).removeClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
						// 			}, _index * 5 + 300);
						// 		});


						// 		$("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[index]).addClass("transparent-layer");
						// 		$("#chapter-02-svg-red g.municipalLayer").not(redLayer[index]).addClass("transparent-layer");
						// 		orangeLayer[index].removeClass("transparent-layer");
						// 		redLayer[index].removeClass("transparent-layer");

						// 		$("#layer-names div").eq(index).removeClass('orange-background').addClass('red-background');
						// 		$("#layer-names div").eq(index+1).removeClass('red-background').addClass('orange-background');
						// 		$("#layer-names div").eq(index+2).removeClass('orange-background');

						// 		console.log("chapter-02-pageChange-0"+index);
						// 	}


						// 	$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( chapter_02_thisPage, changeLayer_02_scrollToBottom, function() {} )); // 아랫방향(순방향)으로 스크롤할 때.
						// 	$(window).on('scroll', onUnderBottomOfViewport( chapter_02_thisPage, changeLayer_02_scrollToTop, function(){} )); // 윗방향(역방향)으로 스크롤할 때.
						// })