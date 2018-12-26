

Promise.all( [ //d3.text("@images/svg_maps/02_cumulative-red-maps/02-1_hiring300_geographic.svg"), 
				d3.text("@images/svg_maps/02_cumulative-red-maps/02-8_expertRate_geographic.svg") ])
		.then( function( _map_svg_array ) {
					var map_svg_red = _map_svg_array[0];

					$("#chapter-03-svg").html(map_svg_red);



					// --------------- tooltip implementation ------------------


						function tooltip_visible( _this_shape, _layerIndex ) {
							tooltip_info_red( _this_shape );
							tooltip_orange.style("display", "none");
							tooltip_red.style("display", "inline");
						}

						function highlight_shape( _this_shape, _layerIndex ) {
							d3.select( _this_shape ).classed("highlighted", true).raise();
						}

						function tooltip_info_red( _this_shape ) {
							var data = d3.select(_this_shape).datum();
							var tooltipHTML;
							if ( data.validForResearch ) // feature가 회색이 아님: 300인 이상 업체가 존재 (1% 이상) 
								tooltipHTML = data.province_name + " <b>" + data.municipal_name + "</b>"
											+ "<br> total 색상반영도: " + d3.format(".1f")(data.score_total);// + " / 100.0";
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
							d3.select( _this_shape ).classed("highlighted", false);
						}

						d3.select("#chapter-03-svg g.municipalLayer").selectAll("polygon, path").each( function( _datum, _shapeIndex) {
							d3.select(this).datum( mainInfo_byLayer( mainInfoArray, 7/* 7 == _layerIndex */, _shapeIndex ) )
											.on("mouseover", function() { 
													tooltip_visible( this ); 
													highlight_shape( this ); 
													tooltip_red.style("left", (event.clientX - $("#tooltip-red").innerWidth()/2) + "px")
																.style("top", (event.clientY - $("#tooltip-red").innerHeight()) + "px");
											})
											.on("mouseout", function() {
													tooltip_hidden( this );
													dehighlight_shape( this );
											})
											.on("mousemove", function() { 
													tooltip_red.style("left", (event.clientX - $("#tooltip-red").innerWidth()/2) + "px")
																.style("top", (event.clientY - $("#tooltip-red").innerHeight()) + "px");
											})
											.classed("gteq-50", function(_shape_datum) { // 이 shape의 전체 색상반영도가 50 이상이면 gteq-50 class를 가짐.
												return _shape_datum.score_total >= 50
											});
						});






						// --------------- CSS transition while scrolling --------------

						var colorMunicipal = [ $("#chapter-03-svg .active-shape"), 
												$("#chapter-03-svg .active-shape#Gokseong"), 
												$("#chapter-03-svg .active-shape#Ulsan_dong, #chapter-03-svg .active-shape#Ulsan_buk"), 
												$("#chapter-03-svg .active-shape#Gunsan"), 
												$("#chapter-03-svg .active-shape#Suwon"), 
												$("#chapter-03-svg .active-shape#Paju"), 
												$("#chapter-03-svg .active-shape.gteq-50"), 
												$("#chapter-03-svg .active-shape") ];

						var changeLayer_03 = function( _index ) {
							$("#chapter-03-svg .active-shape").not( colorMunicipal[_index] ).addClass("transparent-shape");
							colorMunicipal[_index].removeClass("transparent-shape");
							console.log("chapter-03-pageChange-0"+_index);
						}

						$("#chapter-03 div.page").each( function( index ) {
							var chapter_03_thisPage = $("#chapter-03 div.page").eq(index);
							var changeLayer_03_index = function() { changeLayer_03(index) };
							
							$(window).on('resize scroll', onAboveBottomOfViewport( chapter_03_thisPage, changeLayer_03_index, function(){} )); // 트리거가 일시적으로 작동 
							$(window).on('resize scroll', onUnderBottomOfViewport( chapter_03_thisPage, changeLayer_03_index, function(){} ));
						})

						$(window).one('DOMContentLoaded load', function() {
							$("#chapter-03 div.page").each( function(index) { 
								var chapter_03_thisPage = $("#chapter-03 div.page").eq(index);

								if ( !isElementAboveBottomOfViewport( chapter_03_thisPage ) ) {
									if (index < 1) changeLayer_03( 0 ); 
									else changeLayer_03( index-1 );
									return false; // pause .each() loop
								}
								else if ( index >= $("#chapter-03 div.page").length-1 ) 
									changeLayer_03( index );
							});
						});
						
				});
