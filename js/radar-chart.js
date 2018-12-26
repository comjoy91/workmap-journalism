/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
// https://gist.github.com/nbremer/21746a9668ffdf6d8242#file-index-html

	////////////////////////////////////////////////////////////// 
	//////////////////////// Set-Up ////////////////////////////// 
	////////////////////////////////////////////////////////////// 
	var margin = {top: 45, right: 50, bottom: 45, left: 50},
		width = 135, 
		height = 135;
	// var margin = {top: 100, right: 100, bottom: 100, left: 100},
		// width = Math.min(700, window.innerWidth) - margin.left - margin.right,
		// height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
			
	////////////////////////////////////////////////////////////// 
	////////////////////////// Data ////////////////////////////// 
	////////////////////////////////////////////////////////////// 
	var radarChart_data = function(_index) {
					return [
								[
									{ axis: "300인 제조업", value: _radar_graph_data[_index].score_hiringRate_300/3 },
									{ axis: "1000인 제조업", value: _radar_graph_data[_index].score_hiringRate_1000 },
									{ axis: "제1 제조업", value: _radar_graph_data[_index].score_mainIndustryPortion },
									{ axis: "제조업 고령화", value: _radar_graph_data[_index].score_rateOf20sInIndustry },
									{ axis: "일자리 창출", value: _radar_graph_data[_index].score_industryJobCreation },
									{ axis: "직-주 괴리도", value: _radar_graph_data[_index].score_incomeRate },
									{ axis: "과학기술 혁신역량", value: _radar_graph_data[_index].score_R_COSTII },
									{ axis: "관리자 전문가", value: _radar_graph_data[_index].score_expertRate }			
								]
							];
				}
	////////////////////////////////////////////////////////////// 
	//////////////////// Draw the Chart ////////////////////////// 
	////////////////////////////////////////////////////////////// 
	var color = d3.scaleOrdinal(["#ff4d4d"]);
		
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 10,
	  labelFactor: 1.35, 
	  levels: 5,
	  dotRadius: 2,
	  roundStrokes: true,
	  opacityCircles: 0.5,
	  wrapWidth: 40, 
	  colorCircles: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.35)', 'hsla(35, 100%, 60%, 0.7)'],
	  color: color
	};
	//Call function to draw the Radar chart

	d3.selectAll("div.chart-container object.radar-chart").each( function( _data, _index, _node ) {
		RadarChart(this, radarChart_data(_index), radarChartOptions);
	});
	