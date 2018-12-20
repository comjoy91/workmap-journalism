
function data_object_D3(_dataJson_district) {
	var returnObject = {	
		"hiringRate_300": {
			"rawDataName": "전체 종사자 중 300인 이상 제조업체 종사자 비율",
			"rawData": _dataJson_district.hiringRate_300,
			"score": _dataJson_district.score_hiringRate_300
		}, 
		"hiringRate_1000": {
			"rawDataName": "전체 종사자 중 1000인 이상 제조업체 종사자 비율",
			"rawData": _dataJson_district.hiringRate_1000,
			"score": _dataJson_district.score_hiringRate_1000
		}, 
		"mainIndustryPortion": {
			"rawDataName": "300인 이상 제조업체 종사자 중 제1제조업 종사자수",
			"rawData": _dataJson_district.mainIndustryPortion,
			"score": _dataJson_district.score_mainIndustryPortion
		}, 
		"rateOf20sInIndustry": {
			"rawDataName": "전체 제조업체 종사자 중 20대 비율",
			"rawData": _dataJson_district.rateOf20sInIndustry,
			"score": _dataJson_district.score_rateOf20sInIndustry
		}, 
		"industryJobCreation": {
			"rawDataName": "전년도 대비 제조업 일자리 창출량 / 전체 제조업 일자리 규모",
			"rawData": "(비공개)",
			"score": _dataJson_district.score_industryJobCreation
		}, 
		"incomeRate": {
			"rawDataName": "거주지 기준 급여 총액 / 근무지 기준 급여 총액",
			"rawData": _dataJson_district.incomeRate,
			"score": _dataJson_district.score_incomeRate
		}, 
		"R_COSTII": {
			"rawDataName": "과학기술혁신역량지수(R-COSTII)",
			"rawData": _dataJson_district.R_COSTII,
			"score": _dataJson_district.score_R_COSTII
		}, 
		"expertRate": {
			"rawDataName": "취업자 중 관리자·전문가 비율",
			"rawData": _dataJson_district.expertRate,
			"score": _dataJson_district.score_expertRate
		},
		"province_name": _dataJson_district.province_name,
		"municipal_name": _dataJson_district.municipal_name
	};

	return returnObject;
};


function dataInsertion_D3(_dataArray) {
	var returnDataArray = [];

	for (var i=0; i<_dataArray.length; i++) {
		var prop = data_object_D3(_dataArray[i]);
		prop.layerType = [ prop.hiringRate_300,
							prop.hiringRate_1000,
							prop.mainIndustryPortion, 
							prop.rateOf20sInIndustry, 
							prop.industryJobCreation, 
							prop.incomeRate, 
							prop.R_COSTII, 
							prop.expertRate ];

		if ( prop.hiringRate_300.score > 0 ) {
			prop.validForResearch = true; // prop.validForResearch -> 연구대상이냐 아니냐(지도에서 회색이냐 아니냐): hiringRate_300 >= 1%
			prop.exist_300 = true; // prop.exist_300 -> 300인 이상 사업장이 존재하느냐 마느냐: if (prop.exist_300 && prop.validForResearch) hiringRate_300은 0~1% 사이.

			var score_total_variable = 0;
			for (var j=0; j<prop.layerType.length; j++) {
				score_total_variable += prop.layerType[j].score;
				prop.layerType[j].score_total = score_total_variable; 
			}
		}

		else {
			prop.validForResearch = false;

			if (prop.hiringRate_300.rawData == "0.00%") prop.exist_300 = false;
			else prop.exist_300 = true;
		}

		returnDataArray.push(prop);
	}

	return returnDataArray;
};


function mainInfo_byLayer( _mainInfoArray, _layerIndex, _shapeIndex) {
	var prop = _mainInfoArray[_shapeIndex];
	return { "province_name": prop.province_name,
				"municipal_name": prop.municipal_name,
				"rawDataName": prop.layerType[_layerIndex].rawDataName,
				"rawData": prop.layerType[_layerIndex].rawData,
				"score": prop.layerType[_layerIndex].score,
				"score_total": prop.layerType[_layerIndex].score_total,
				"validForResearch": prop.validForResearch,
				"exist_300": prop.exist_300 };
}

var mainInfoArray = dataInsertion_D3(_dataJSON_2016.municipals);



function matching_DOMshape_orange( _this_shape, _layerIndex ) {
	var index_orange = $("#chapter-02-svg-orange g.municipalLayer").eq( _layerIndex ).children().index( _this_shape );
	var index_red = $("#chapter-02-svg-red g.municipalLayer").eq( _layerIndex ).children().index( _this_shape );
	var shape_index = Math.max(index_orange, index_red); // 만약 _this_shape가 존재하지 않으면, index_orange(index_red)는 -1을 가리킴.
	return $("#chapter-02-svg-orange g.municipalLayer").eq( _layerIndex ).children().eq(shape_index)[0];
}
function matching_DOMshape_red( _this_shape, _layerIndex ) {
	var index_orange = $("#chapter-02-svg-orange g.municipalLayer").eq( _layerIndex ).children().index( _this_shape );
	var index_red = $("#chapter-02-svg-red g.municipalLayer").eq( _layerIndex ).children().index( _this_shape );
	var shape_index = Math.max(index_orange, index_red); // 만약 _this_shape가 존재하지 않으면, index_orange(index_red)는 -1을 가리킴.
	return $("#chapter-02-svg-red g.municipalLayer").eq( _layerIndex ).children().eq(shape_index)[0];
}

function tooltip_visible( _this_shape, _layerIndex ) {
	tooltip_info_orange( matching_DOMshape_orange( _this_shape, _layerIndex ) );
	tooltip_info_red( matching_DOMshape_red( _this_shape, _layerIndex ) );
	tooltip_orange.style("display", "inline");
	tooltip_red.style("display", "inline");
}


function highlight_shape( _this_shape, _layerIndex ) {
	var DOMshape_orange = matching_DOMshape_orange( _this_shape, _layerIndex );
	var DOMshape_red = matching_DOMshape_red( _this_shape, _layerIndex );
	d3.select( DOMshape_orange ).classed("highlighted", true).raise();
	d3.select( DOMshape_red ).classed("highlighted", true).raise();
}

function tooltip_info_orange( _this_shape ) {
	var data = d3.select(_this_shape).datum();
	var tooltipHTML;
	if ( data.validForResearch ) // feature가 회색이 아님: 300인 이상 업체가 존재 (1% 이상) 
		tooltipHTML = data.province_name + " <b>" + data.municipal_name + "</b>"
					+ "<br>" + data.rawDataName + ": " + data.rawData
					+ "<br> 색상반영도: " + d3.format(".1f")(data.score);// + " / 100.0";
	else if ( data.exist_300 ) // feature가 회색이고, 300인 이상 업체가 존재: 300인 이상 업체 0~1%
		tooltipHTML = data.province_name + " <b>" + data.municipal_name + "</b>"
					+ "<br> 색상 표시하지 않음: 300인 이상 제조업체 종사자 비율이 1% 미만임";
	else // feature가 회색이고, 300인 이상 업체가 존재하지 않음: 300인 이상 업체 0%
		tooltipHTML = data.province_name + " <b>"  + data.municipal_name + "</b>"
					+ "<br> 색상 표시하지 않음: 300인 이상 제조업체 없음";	

	tooltip_orange.html( tooltipHTML );
}

function tooltip_info_red( _this_shape ) {
	var data = d3.select(_this_shape).datum();
	var tooltipHTML;
	if ( data.validForResearch ) // feature가 회색이 아님: 300인 이상 업체가 존재 (1% 이상) 
		tooltipHTML = data.province_name + " <b>" + data.municipal_name + "</b>"
					+ "<br> 지금까지 겹쳐진 색상반영도: " + d3.format(".1f")(data.score_total);// + " / 100.0";
	else if ( data.exist_300 ) // feature가 회색이고, 300인 이상 업체가 존재: 300인 이상 업체 0~1%
		tooltipHTML = data.province_name + " <b>" + data.municipal_name + "</b>"
					+ "<br> 색상 표시하지 않음: 300인 이상 제조업체 종사자 비율이 1% 미만임";
	else // feature가 회색이고, 300인 이상 업체가 존재하지 않음: 300인 이상 업체 0%
		tooltipHTML = data.province_name + " <b>"  + data.municipal_name + "</b>"
					+ "<br> 색상 표시하지 않음: 300인 이상 제조업체 없음";	

	tooltip_red.html( tooltipHTML );
}


function tooltip_hidden() {
	tooltip_orange.style("display", "none");
	tooltip_red.style("display", "none");
}
function dehighlight_shape( _this_shape, _layerIndex ) {
	d3.select( matching_DOMshape_orange( _this_shape, _layerIndex ) ).classed("highlighted", false);
	d3.select( matching_DOMshape_red( _this_shape, _layerIndex ) ).classed("highlighted", false);
}




Promise.all( [ d3.text("@images/svg_maps/01_single-orange-maps/01-0_single-orange-maps.svg"), 
				d3.text("@images/svg_maps/02_cumulative-red-maps/02-0_cumulative-red-maps.svg") ])
		.then( function( _map_svg_array ) {
					var map_svg_orange = _map_svg_array[0];
					var map_svg_red = _map_svg_array[1];

					$("#chapter-02-svg-orange").html(map_svg_orange);
					$("#chapter-02-svg-red").html(map_svg_red);

					// --------------- tooltip implementation ------------------


						d3.selectAll("#chapter-02-svg-orange g.municipalLayer").each( function( _datum, _layerIndex) {
							d3.select(this).selectAll("polygon, path").each( function( _datum, _shapeIndex) {
								d3.select(this).datum( mainInfo_byLayer( mainInfoArray, _layerIndex+1, _shapeIndex ) )
												.on("mouseover", function() { 
														tooltip_visible( this, _layerIndex ); 
														highlight_shape( this, _layerIndex ); 
												})
												.on("mouseout", function() {
														tooltip_hidden( this, _layerIndex );
														dehighlight_shape( this, _layerIndex );
												})
												.on("mousemove", function() { 
														tooltip_orange.style("left", (event.clientX - $("#tooltip-orange").innerWidth()/2) + "px")
																		.style("top", (event.clientY - $("#tooltip-orange").innerHeight()) + "px");
														tooltip_red.style("left", (event.clientX + $(window).width()*43/100 - $("#tooltip-red").innerWidth()/2) + "px")
																	.style("top", (event.clientY - $("#tooltip-red").innerHeight()) + "px");
												});
							})
						});

						d3.selectAll("#chapter-02-svg-red g.municipalLayer").each( function( _datum, _layerIndex) {
							d3.select(this).selectAll("polygon, path").each( function( _datum, _shapeIndex) {
								d3.select(this).datum( mainInfo_byLayer( mainInfoArray, _layerIndex, _shapeIndex ) )
												.on("mouseover", function() { 
														tooltip_visible( this, _layerIndex ); 
														highlight_shape( this, _layerIndex ); 
												})
												.on("mouseout", function() {
														tooltip_hidden( this, _layerIndex );
														dehighlight_shape( this, _layerIndex );
												})
												.on("mousemove", function() { 
														tooltip_red.style("left", (event.clientX - $("#tooltip-red").innerWidth()/2) + "px")
																	.style("top", (event.clientY - $("#tooltip-red").innerHeight()) + "px");
														tooltip_orange.style("left", (event.clientX - $(window).width()*43/100 - $("#tooltip-orange").innerWidth()/2) + "px")
																		.style("top", (event.clientY - $("#tooltip-orange").innerHeight()) + "px");
												});
							})
						});


						// --------------- CSS transition while scrolling --------------

						var orangeLayer = [ // $("#chapter-02-svg-orange g#01-1_hiring300"), 
											$("#chapter-02-svg-orange g#01-2_hiring1000"), 
											$("#chapter-02-svg-orange g#01-3_mainIndustry"), 
											$("#chapter-02-svg-orange g#01-4_20s"), 
											$("#chapter-02-svg-orange g#01-5_jobCreation"), 
											$("#chapter-02-svg-orange g#01-6_incomeRate"), 
											$("#chapter-02-svg-orange g#01-7_R-COSTII"), 
											$("#chapter-02-svg-orange g#01-8_expertRate") ];
											
						var redLayer = [ $("#chapter-02-svg-red g#02-1_hiring300"), 
											$("#chapter-02-svg-red g#02-2_hiring1000"), 
											$("#chapter-02-svg-red g#02-3_mainIndustry"), 
											$("#chapter-02-svg-red g#02-4_20s"), 
											$("#chapter-02-svg-red g#02-5_jobCreation"), 
											$("#chapter-02-svg-red g#02-6_incomeRate"), 
											$("#chapter-02-svg-red g#02-7_R-COSTII"), 
											$("#chapter-02-svg-red g#02-8_expertRate") ];

						function layer_and_layerName_change( _layerIndex ) {
							$("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[_layerIndex]).addClass("transparent-layer");
							$("#chapter-02-svg-red g.municipalLayer").not(redLayer[_layerIndex]).addClass("transparent-layer");
							orangeLayer[_layerIndex].removeClass("transparent-layer");
							redLayer[_layerIndex].removeClass("transparent-layer");

							$("#layer-names div").eq(_layerIndex).removeClass('orange-background').addClass('red-background')
																.prevAll().removeClass('orange-background').addClass('red-background');
							$("#layer-names div").eq(_layerIndex+1).removeClass('red-background').addClass('orange-background')
																.nextAll().removeClass('orange-background');

							console.log("chapter-02-pageChange-0"+_layerIndex);
						}

						var changeLayer_02_scrollToTop = function( _layerIndex ) {
							orangeLayer[_layerIndex].prevAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transform-toRight-shape transparent-shape"); 
									}, _shapeIndex * 5 );
								});
							});
							orangeLayer[_layerIndex].nextAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
									}, _shapeIndex * 5 );
								});
							});

							redLayer[_layerIndex].prevAll("#chapter-02-svg-red g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
									}, _shapeIndex * 5 );
								});
							});
							redLayer[_layerIndex].nextAll("#chapter-02-svg-red g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transparent-shape visibility-noDelay"); 
									}, _shapeIndex * 5 );
								});
							});

							redLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								setTimeout( function() { 
									$(_ele).addClass("visibility-noDelay").removeClass("transparent-shape"); 
								}, _shapeIndex * 5 );
							});

							orangeLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								setTimeout( function() { 
									$(_ele).addClass("visibility-noDelay").removeClass("transform-toRight-shape transparent-shape"); 
								}, _shapeIndex * 5 );
							});

							layer_and_layerName_change( _layerIndex );
						};

						var changeLayer_02_scrollToTop_ready = function( _layerIndex ) {
							orangeLayer[_layerIndex].prevAll("#chapter-02-svg-orange g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transform-toRight-shape transparent-shape"); 
							});
							orangeLayer[_layerIndex].nextAll("#chapter-02-svg-orange g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
							});

							redLayer[_layerIndex].prevAll("#chapter-02-svg-red g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
							});
							redLayer[_layerIndex].nextAll("#chapter-02-svg-red g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transparent-shape visibility-noDelay"); 
							});

							redLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("visibility-noDelay").removeClass("transparent-shape"); 
							});

							orangeLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("visibility-noDelay").removeClass("transform-toRight-shape transparent-shape"); 
							});

							layer_and_layerName_change( _layerIndex );
						};

						var changeLayer_02_scrollToBottom = function( _layerIndex ) {
							event.stopImmediatePropagation();
							orangeLayer[_layerIndex].prevAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transform-toRight-shape transparent-shape").removeClass("visibility-noDelay"); 
									}, _shapeIndex * 5 );
								});
							});
							orangeLayer[_layerIndex].nextAll("#chapter-02-svg-orange g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transparent-shape").removeClass("transform-toRight-shape"); 
									}, _shapeIndex * 5 );
								});
							});

							redLayer[_layerIndex].prevAll("#chapter-02-svg-red g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
									}, _shapeIndex * 5 );
								});
							});
							redLayer[_layerIndex].nextAll("#chapter-02-svg-red g.municipalLayer").each( function() {
								$(this).children(".active-shape").each( function( _shapeIndex, _ele ) {
									setTimeout( function() { 
										$(_ele).addClass("transparent-shape visibility-noDelay"); 
									}, _shapeIndex * 5 );
								});
							});

							redLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								setTimeout( function() { 
									$(_ele).removeClass("transparent-shape visibility-noDelay"); 
								}, _shapeIndex * 5 );
							});

							orangeLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								setTimeout( function() { 
									$(_ele).removeClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
								}, _shapeIndex * 5 /*+ 300*/);
							});

							layer_and_layerName_change( _layerIndex ); console.log("window resize?")
						};

						var changeLayer_02_scrollToBottom_ready = function( _layerIndex ) {
							orangeLayer[_layerIndex].prevAll("#chapter-02-svg-orange g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transform-toRight-shape transparent-shape").removeClass("visibility-noDelay"); 
							});
							orangeLayer[_layerIndex].nextAll("#chapter-02-svg-orange g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transparent-shape").removeClass("transform-toRight-shape"); 
							});

							redLayer[_layerIndex].prevAll("#chapter-02-svg-red g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transparent-shape").removeClass("visibility-noDelay"); 
							});
							redLayer[_layerIndex].nextAll("#chapter-02-svg-red g.municipalLayer")
													.children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).addClass("transparent-shape visibility-noDelay"); 
							});

							redLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).removeClass("transparent-shape visibility-noDelay"); 
							});

							orangeLayer[_layerIndex].children(".active-shape").each( function( _shapeIndex, _ele ) {
								$(_ele).removeClass("transparent-shape visibility-noDelay").removeClass("transform-toRight-shape"); 
							});

							layer_and_layerName_change( _layerIndex );
						};


						$("#chapter-02 div.page").each( function(index) { 

							var chapter_02_thisPage = $("#chapter-02 div.page").eq(index);
							var changeLayer_02_scrollToBottom_index = function() { changeLayer_02_scrollToBottom( index ) };
							var changeLayer_02_scrollToTop_index = function() { changeLayer_02_scrollToTop( index ) };

							$(window).on(/*'DOMContentLoaded load resize scroll'*/'resize scroll', onAboveBottomOfViewport( chapter_02_thisPage, changeLayer_02_scrollToBottom_index, function() {} )) // 아랫방향(순방향)으로 스크롤할 때.
									.on('resize scroll', onUnderBottomOfViewport( chapter_02_thisPage, changeLayer_02_scrollToTop_index, function(){} )); // 윗방향(역방향)으로 스크롤할 때.
						});

						$("#chapter-02 div.page").each( function(index) { 

							var chapter_02_thisPage = $("#chapter-02 div.page").eq(index);
							var changeLayer_02_scrollToBottom_ready_index = function() { changeLayer_02_scrollToBottom_ready( index ) };
							var changeLayer_02_scrollToTop_ready_index = function() { changeLayer_02_scrollToTop_ready( index ) };

							if ( !isElementAboveBottomOfViewport( chapter_02_thisPage ) ) {
								if (index < 1) changeLayer_02_scrollToBottom_ready( 0 ); 
								else changeLayer_02_scrollToBottom_ready( index-1 );
								return false; // pause .each() loop
							}
							else if ( index >= $("#chapter-02 div.page").length-1 ) 
								changeLayer_02_scrollToBottom_ready( index );
						});
						
				});
