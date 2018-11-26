// ---------- importing SVG: define its path ----------

const map_svg = "@images/svg_maps/01_single-orange-maps/01-1_hiring300.svg";




// ---------- BACKGROUND MAP LAYER ----------

var windowWidth, windowHeight, wideRatio = 0;
windowWidth = $(window).width();
windowHeight = $(window).height();
wideRatio = windowWidth / windowHeight;

var mbAttr = '<a href="https://www.maptiler.com/license/maps/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
	mbUrl = 'https://maps.tilehosting.com/data/hillshades/{z}/{x}/{y}.png?key=JrAhm6tBG7Y3CCaBBIMe';
var grayscale = L.tileLayer(mbUrl, {attribution: mbAttr, opacity: 0.6});

var map = L.map( 'chapter-01-map', {
					layers: [grayscale], 
					zoomControl: false, 
					attributionControl: false,
					minZoom: 5, 
					maxZoom: 12,
					zoomSnap: 0.5,
					zoomDelta: 0.5,
					boxZoom: false, 
					doubleClickZoom: false, 
					scrollWheelZoom: false, 
					dragging: false, 
					tap: false, 
					touchZoom: false } );
var attribution = L.control.attribution({position: 'bottomleft'}).addTo(map);
// L.control.zoom({position: 'topleft'}).addTo(map);

{ // initial map view setting by different browser window width.
	if ( windowWidth >= 1025 ) {
		map.setView([36, 126], 7.5);
	}
	else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
		map.setView([36, 131], 6.5);
	}
	else if ( windowWidth >= 768 ) {
		map.setView([36.3, 129.3], 7.5);
	}
	else { 
		map.setView([34.5, 127.7], 6.5);
	}
}


// ---------- functions for implementing rawData and score into initial geoJSON data.

function data_object(_dataJson_district) {
	var returnObject = {	
		"hiringRate_300": {
			"rawData": _dataJson_district.hiringRate_300,
			"score": _dataJson_district.score_hiringRate_300
		}, 
		"hiringRate_1000": {
			"rawData": _dataJson_district.hiringRate_1000,
			"score": _dataJson_district.score_hiringRate_1000
		}, 
		"mainIndustryPortion": {
			"rawData": _dataJson_district.mainIndustryPortion,
			"score": _dataJson_district.score_mainIndustryPortion
		}, 
		"rateOf20sInIndustry": {
			"rawData": _dataJson_district.rateOf20sInIndustry,
			"score": _dataJson_district.score_rateOf20sInIndustry
		}, 
		"industryJobCreation": {
			"rawData": _dataJson_district.industryJobCreation,
			"score": _dataJson_district.score_industryJobCreation
		}, 
		"incomeRate": {
			"rawData": _dataJson_district.incomeRate,
			"score": _dataJson_district.score_incomeRate
		}, 
		"R_COSTII": {
			"rawData": _dataJson_district.R_COSTII,
			"score": _dataJson_district.score_R_COSTII
		}, 
		"expertRate": {
			"rawData": _dataJson_district.expertRate,
			"score": _dataJson_district.score_expertRate
		},
		"population": _dataJson_district.population, 
		"mean_age": _dataJson_district.mean_age, 
		"numWorkers_inDistrict": _dataJson_district.numWorkers_inDistrict, 
		// "numWorkers_0": _dataJson_district.numWorkers_0, 
		// "numWorkers_300": _dataJson_district.numWorkers_300, 
		// "numWorkers_1000": _dataJson_district.numWorkers_1000, 
		// "mainIndustry_0": _dataJson_district.mainIndustry_0, 
		"mainIndustry_300": _dataJson_district.mainIndustry_300, 
		// "mainIndustry_1000": _dataJson_district.mainIndustry_1000,
		"factory": _dataJson_district.factory, 
		"additional_note": _dataJson_district.additional_note
	};

	return returnObject;
};

function dataInsertion(_featureArray, _dataArray) {
	for (var i=0; i<_featureArray.features.length; i++) {
		var prop = _featureArray.features[i].properties;
		prop.data = [];

		for (var j=0; j<_dataArray.length; j++) {
			prop.data.push(data_object(_dataArray[j][i]));
		}
		
		if ( prop.data[j-1].hiringRate_300.score > 0 ) {
			prop.validForResearch = true; // prop.validForResearch -> 연구대상이냐 아니냐(지도에서 회색이냐 아니냐): hiringRate_300 >= 1%
			prop.exist_300 = true; // prop.exist_300 -> 300인 이상 사업장이 존재하느냐 마느냐: if (prop.exist_300 && prop.validForResearch) hiringRate_300은 0~1% 사이.
		}
		else {
			prop.validForResearch = false;

			if (prop.data[j-1].hiringRate_300.rawData == "0.00%") prop.exist_300 = false;
			else prop.exist_300 = true;
		}
		prop.score_total = prop.data[j-1].hiringRate_300.score;// / 3 * 5;
	}
};

var municipalData = [_dataJSON_2014.municipals, _dataJSON_2015.municipals, _dataJSON_2016.municipals];
var provinceData = [_dataJSON_2014.provinces, _dataJSON_2015.provinces, _dataJSON_2016.provinces];
dataInsertion(municipalGeoJSON, municipalData);
dataInsertion(provinceGeoJSON, provinceData);


// ---------- variable which is related to #mapYear_slider
var updateScore = function() { updateScore_check(); }; // recent "updateScore" function variable, depends on which #menu_mapNav is selected.
var year_index = 2; // 2014: 0, 2015: 1, 2016: 2. It is used in "js/leaflet_script.js"


// ---------- variable which shows selected polygon (municipal layer, province layer).  Mostly used in "js/leaflet_script.js"
var current_municipal_layer = null;
var current_province_layer = null;

var search_contents = []; // array for search_contents. Mostly used in "js/leaflet_script.js"



// ---------- function for getting "getBoundingClientRect()"
function getBound (el) {

	//special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	return el.getBoundingClientRect();
};



(function($){

	function resizeWindow() { // extra working by different browser window width.
		var svgBound = getBound($("#chapter-01-map .leaflet-overlay-pane svg g"));
		$("#chapter-02-svgs object").width( svgBound.width )
									.css( { top: svgBound.top+'px', left: svgBound.left+'px' } );

		windowWidth = $(window).width();
		windowHeight = $(window).height();
		wideRatio = windowWidth / windowHeight;
		if ( windowWidth >= 1025 ) {
			$("#mapYear_slider").slider( "option", "orientation", "horizontal" );
			$("#mapNav").attr( {class: "", style: ""} );
			attribution.setPosition("bottomleft");
		}

		else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
			$("#mapYear_slider").slider( "option", "orientation", "horizontal" );
			$("#mapNav").addClass( "ui popup bottom right" );
			attribution.setPosition("bottomleft");
		}

		else if ( windowWidth >= 768 ) {
			$("#mapYear_slider").slider( "option", "orientation", "vertical" );
			$("#mapNav").attr( {class: "", style: ""} );
			attribution.setPosition("bottomleft");
		}

		else { 
			$("#mapYear_slider").slider( "option", "orientation", "horizontal" );
			$("#mapNav").addClass( "ui popup bottom right" );
			attribution.setPosition("topright");
		}
	}

	$(window).on("load", function() {//먼저 js파일들을 모두 로드. 




		$("#info_scrollingTop").click( function() { // scroll #dataInfo down in mobile devices.
			event.preventDefault();
			$('html, body').stop().animate({
				scrollTop: 0
			}, 600,'easeOutCubic');
		});

		//Create SVG element
		// zoomedMap = d3.zoom()
		// 				.scaleExtent([0.5, 15])
		// 				// .translateExtent([[-width*1.5, -height*1.5], [width*5, height*5]])
		// 				.on("zoom", function() {
		// 					document.body.style.cursor="move";
		// 					svgContainer.attr("transform", d3.event.transform); })
		// 				.on("end", function() { document.body.style.cursor="default"; } );



		// var q_init = d3.queue();
		// q_init//.defer( d3.json, d3_mapping_config_json_file )
		// .defer( d3.xml, map_svg )
		// .await(function(error, _map_xml) {
		// 	if (error) throw error;

		// 	var map_svg_imported = d3.select(_map_xml.documentElement).node().outerHTML;
		// 	$("#chapter-02-svgs").html(map_svg_imported);
		// 	// width = d3_config["width"];
		// 	// height = d3_config["height"];
		// 	// originX = (window.innerWidth-width)/2;
		// 	// originY = (window.innerHeight-height+200)/2;			
		// 	// d3.select("#map_background").call(zoomedMap);
		// 	// d3.select("#map_background").call(zoomedMap.transform, d3.zoomIdentity.scale(1).translate(originX, originY));

		// });

		// updateScore_check();
		resizeWindow();
		// if ( (windowWidth >= 768 && windowWidth < 1025 && wideRatio > 2/1) || (windowWidth < 768) )  { // show popup initially.
		// 	$("#mapNav_popup").popup('show');
		// }
	});

	$(window).on("resize", resizeWindow); // 창 크기가 바뀔 때에는 resizeWindow() 가동

})(jQuery);

