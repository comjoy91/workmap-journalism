
// ------------------------ #bar-chart-01 ------------------------------

var build_barChart_01 = function() {

	// set the dimensions and margins of the graph
	var margin_01 = {	top: 0, 
						right: $("#bar-chart-01").width()*0.02, 
						bottom: parseFloat($("#bar-chart-01").css("font-size")) + 6, 
						left: 17.369 * parseFloat($("#bar-chart-01").css("font-size")) + 6 },
		width_01 = $("#bar-chart-01").width() - margin_01.left - margin_01.right,
		height_01 = parseFloat($("#bar-chart-01").css("font-size"))*2.2*19 - margin_01.top - margin_01.bottom;
	var svgWidth_01 = width_01 + margin_01.left + margin_01.right, 
		svgHeight_01 = height_01 + margin_01.top + margin_01.bottom;

	// set the ranges
	var y_01 = d3.scaleBand()
						.range([0, height_01])
						.padding(0.3);

	var x_01 = d3.scaleLinear()
						.range([0, width_01]);
						
	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg_01 = d3.select("#bar-chart-01").append("svg")
			.attr("width", svgWidth_01)
			.attr("height", svgHeight_01)
			.attr("viewBox", "0 0 "+svgWidth_01+" "+svgHeight_01)
				.append("g")
				.attr("transform", "translate(" + margin_01.left + "," + margin_01.top + ")");

	// Scale the range of the data in the domains
	x_01.domain([0, 2.2])
	y_01.domain(_industry_income.map(function(d) { return d.industry; }));


	// append the rectangles for the bar chart
	svg_01.append("g").selectAll(".bar")
			.data(_industry_income)
			.enter().append("rect")
				.attr("class", "bar")
				//.attr("x", function(d) { return x(d.sales); })
				.attr("width", function(d) {return x_01(d.incomeRate); } )
				.attr("y", function(d) { return y_01(d.industry); })
				.attr("height", y_01.bandwidth())
				.attr("fill", function(d) { return d.fill_colour; });

	// add the x Axis
	var axisX_01 = svg_01.append("g")
					.attr("transform", "translate(0," + height_01 + ")")
					.call(d3.axisBottom(x_01).tickSize(-height_01).tickPadding(6).tickArguments([4]).tickFormat(d3.format(".0%")))
	axisX_01.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
	axisX_01.select(".domain").remove();			

	// add the y Axis
	var axisY_01 = svg_01.append("g")
					.call(d3.axisLeft(y_01).tickSize(0).tickPadding(6));
	axisY_01.select(".domain").remove();
	axisY_01.selectAll("g text")
			.data(_industry_income)
			.attr("font-weight", function(d) { return d.font_weight; });


}









// ------------------------ #bar-chart-02 ------------------------------



var build_barChart_02 = function() {

	// set the dimensions and margins of the graph
	var margin_02 = {	top: 0, 
						right: $("#bar-chart-02").width()*0.02, 
						bottom: parseFloat($("#bar-chart-02").css("font-size")) + 12,  
						left: 7.628 * parseFloat($("#bar-chart-02").css("font-size")) + 6 },
		width_02 = $("#bar-chart-02").width() - margin_02.left - margin_02.right,
		height_02 = parseFloat($("#bar-chart-02").css("font-size"))*2.2*25 - margin_02.top - margin_02.bottom;
	var svgWidth_02 = width_02 + margin_02.left + margin_02.right, 
		svgHeight_02 = height_02 + margin_02.top + margin_02.bottom;

	// classes of bar colours
	var keyArray = [ "low-skill-colour", "middle-skill-colour", "high-skill-colour" ];

	// set the ranges
	var y_02_nation = d3.scaleBand()
						.domain(_national_jobCreation.map(function(d) { return d.nation; }))
						.range([0, height_02])
						.padding(0);
	var y_02_bar = d3.scaleBand()
						.domain(keyArray)
						.range([0, y_02_nation.bandwidth()])
						.paddingInner(0).paddingOuter(0.5);

	var x_02 = d3.scaleLinear()
						.domain([-18, 18])
						.range([0, width_02]);
						
	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg_02 = d3.select("#bar-chart-02").append("svg")
			.attr("width", svgWidth_02)
			.attr("height", svgHeight_02)
			.attr("viewBox", "0 0 "+svgWidth_02+" "+svgHeight_02)
				.append("g")
				.attr("transform", "translate(" + margin_02.left + "," + margin_02.top + ")");


	// add the y Axis
	var axisY_02_nation = svg_02.append("g")
					.call(d3.axisLeft(y_02_nation).tickSize(-width_02).tickPadding(6));
	axisY_02_nation.selectAll(".tick:nth-child(even) line").attr("stroke", "#eee").attr("stroke-width", y_02_nation.bandwidth());
	axisY_02_nation.selectAll(".tick:nth-child(odd) line").attr("stroke", "#fff").attr("stroke-width", y_02_nation.bandwidth());
	axisY_02_nation.select(".domain").remove();
	axisY_02_nation.selectAll("g text")
			.data(_national_jobCreation)
			.attr("font-weight", function(d) { return d.font_weight; });


	// append the rectangles for the bar chart
	svg_02.append("g").selectAll(".nation")
			.data(_national_jobCreation)
			.enter().append("g")
			.attr("class", "nation")
			.attr("y", function(d_nation) { return y_02_nation(d_nation.nation); })
				.selectAll(".bar")
				.data(function(d_nation) { return keyArray.map( function(key) {
																	return { 	
																		key: key, 
																		value: d_nation[key], 
																		y_nation: y_02_nation(d_nation.nation)
																	}; 
																}); 
											})
				.enter().append("rect")
					.attr("class", function(d_bar) { return "bar " + d_bar.key; } )
					.attr("x", function(d_bar) { 
									if (d_bar.value < 0) return x_02(d_bar.value); 
									else return x_02(0); } )
					.attr("width", function(d_bar) { 
									if (d_bar.value < 0) return x_02(0) - x_02(d_bar.value); 
									else return x_02(d_bar.value) - x_02(0) } )
					.attr("y", function(d_bar) { return d_bar.y_nation + y_02_bar(d_bar.key); })
					.attr("height", y_02_bar.bandwidth());




	// add the x Axis
	var axisX_02 = svg_02.append("g")
					.attr("transform", "translate(0," + height_02 + ")")
					.call(d3.axisBottom(x_02).tickSize(-height_02).tickPadding(12).tickValues([0, -15, -10, -5, 5, 10, 15]).tickFormat(d3.format("+")))
	axisX_02.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
	axisX_02.select(".tick:first-of-type line").attr("stroke-width", "2");
	axisX_02.select(".domain").remove();		


}	







build_barChart_01();
build_barChart_02();