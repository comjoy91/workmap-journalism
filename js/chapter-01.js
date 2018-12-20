

d3.text("@images/svg_maps/02_cumulative-red-maps/02-1_hiring300_geographic.svg")
		.then( function( _map_svg_text ) {
					var map_svg_red = _map_svg_text;

					$("#chapter-01-svg").html(map_svg_red);



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
											+ "<br>" + data.rawDataName + ": " + data.rawData
											+ "<br> 현재 색상반영도: " + d3.format(".1f")(data.score_total);// + " / 100.0";
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

						d3.select("#chapter-01-svg g.municipalLayer").selectAll("polygon, path").each( function( _datum, _shapeIndex) {
							d3.select(this).datum( mainInfo_byLayer( mainInfoArray, 0/* 0 == _layerIndex */, _shapeIndex ) )
											.on("mouseover", function() { 
													tooltip_visible( this ); 
													highlight_shape( this ); 
											})
											.on("mouseout", function() {
													tooltip_hidden( this );
													dehighlight_shape( this );
											})
											.on("mousemove", function() { 
													tooltip_red.style("left", (event.clientX - $("#tooltip-red").innerWidth()/2) + "px")
																.style("top", (event.clientY - $("#tooltip-red").innerHeight()) + "px");
											});
						});
						
				});
