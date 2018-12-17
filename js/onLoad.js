// ---------- importing SVG: define its path ----------

const map_svg = "@images/svg_maps/01_single-orange-maps/01-1_hiring300.svg";

const modified_mapWidth_const = 377 / 574;
const modified_mapLeft_const = 85;
const modified_mapWidth = 377;



// ---------- BACKGROUND MAP LAYER ----------

var windowWidth, windowHeight, wideRatio = 0;
windowWidth = $(window).width();
windowHeight = $(window).height();
wideRatio = windowWidth / windowHeight;

var mbAttr = '<a href="https://www.maptiler.com/license/maps/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
	mbUrl = 'https://maps.tilehosting.com/data/hillshades/{z}/{x}/{y}.png?key=JrAhm6tBG7Y3CCaBBIMe';
var grayscale_01 = L.tileLayer(mbUrl, {attribution: mbAttr, opacity: 0.6});
var grayscale_03 = L.tileLayer(mbUrl, {attribution: mbAttr, opacity: 0.6});

var map_01 = L.map( 'chapter-01-map', {
					layers: [grayscale_01], 
					zoomControl: false, 
					attributionControl: false,
					minZoom: 5, 
					maxZoom: 12,
					zoomSnap: 0.1,
					zoomDelta: 0.1,
					boxZoom: false, 
					doubleClickZoom: false, 
					scrollWheelZoom: false, 
					dragging: false, 
					tap: false, 
					touchZoom: false } );
var attribution_01 = L.control.attribution({position: 'bottomright'}).addTo(map_01);
var map_03 = L.map( 'chapter-03-map', {
					layers: [grayscale_03], 
					zoomControl: false, 
					attributionControl: false,
					minZoom: 5, 
					maxZoom: 12,
					zoomSnap: 0.1,
					zoomDelta: 0.1,
					boxZoom: false, 
					doubleClickZoom: false, 
					scrollWheelZoom: false, 
					dragging: false, 
					tap: false, 
					touchZoom: false } );
var attribution_03 = L.control.attribution({position: 'bottomright'}).addTo(map_03);
// L.control.zoom({position: 'topleft'}).addTo(map);

{ // initial map view setting by different browser window width.
	if ( windowWidth >= 1025 ) {
		map_01.setView([35.95, 125.5], 7.3);
		map_03.setView([35.95, 125.5], 7.3);
	}
	else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
		map_01.setView([36, 131], 6.5);
		map_03.setView([36, 131], 6.5);
	}
	else if ( windowWidth >= 768 ) {
		map_01.setView([36.3, 129.3], 7.5);
		map_03.setView([36.3, 129.3], 7.5);
	}
	else { 
		map_01.setView([34.5, 127.7], 6.5);
		map_03.setView([34.5, 127.7], 6.5);
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
		"mainIndustry_300": _dataJson_district.mainIndustry_300,
		"factory": _dataJson_district.factory, 
		"additional_note": _dataJson_district.additional_note
	};

	return returnObject;
};

function dataInsertion(_featureArray, _dataArray) {
	for (var i=0; i<_featureArray.features.length; i++) {
		var prop = _featureArray.features[i].properties;
		prop.data = [];
		prop.score_total = 0;

		for (var j=0; j<_dataArray.length; j++) {
			prop.data.push(data_object(_dataArray[j][i]));
		}
		
		if ( prop.data[j-1].hiringRate_300.score > 0 ) {
			var data = prop.data[j-1];
			prop.validForResearch = true; // prop.validForResearch -> 연구대상이냐 아니냐(지도에서 회색이냐 아니냐): hiringRate_300 >= 1%
			prop.exist_300 = true; // prop.exist_300 -> 300인 이상 사업장이 존재하느냐 마느냐: if (prop.exist_300 && prop.validForResearch) hiringRate_300은 0~1% 사이.
			
			prop.score_total += data.hiringRate_300.score;
			prop.score_total += data.hiringRate_1000.score;
			prop.score_total += data.mainIndustryPortion.score;
			prop.score_total += data.rateOf20sInIndustry.score;
			prop.score_total += data.industryJobCreation.score;
			prop.score_total += data.incomeRate.score;
			prop.score_total += data.R_COSTII.score;
			prop.score_total += data.expertRate.score;
		}
		else {
			prop.validForResearch = false;

			if (prop.data[j-1].hiringRate_300.rawData == "0.00%") prop.exist_300 = false;
			else prop.exist_300 = true;
		}
	}
};

var municipalData = [_dataJSON_2016.municipals];
var provinceData = [_dataJSON_2016.provinces];
dataInsertion(municipalGeoJSON, municipalData);
dataInsertion(provinceGeoJSON, provinceData);

// ---------- variable which is related to #mapYear_slider
// var updateScore = function() { updateScore_check(); }; // recent "updateScore" function variable, depends on which #menu_mapNav is selected.
var year_index = 0; // 2016: 0. It is used in "js/leaflet_script.js"

// ---------- variable which shows selected polygon (municipal layer, province layer).  Mostly used in "js/leaflet_script.js"
var current_municipal_layer = null;
var current_province_layer = null;




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
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		wideRatio = windowWidth / windowHeight;
		if ( windowWidth >= 1025 ) {
		}

		else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
		}

		else if ( windowWidth >= 768 ) {
		}

		else { 
		}
	}

	$(window).on("load", resizeWindow );


	$(window).on(/*"DOMContentLoaded load"*/ "load", function() {//먼저 js파일들을 모두 로드. 

		d3.text("@images/svg_maps/01_single-orange-maps/01-0_single-orange-maps.svg")
			.then( function(map_svg_imported) {
				$("#chapter-02-svg-orange").html(map_svg_imported);

				d3.text("@images/svg_maps/02_cumulative-red-maps/02-0_cumulative-red-maps.svg")
					.then( function(map_svg_imported) {
						$("#chapter-02-svg-red").html(map_svg_imported);

						$("#chapter-02 div.page").each( function(index) {
							var changeLayer_02 = function() {
								var orangeLayer = [ $("#chapter-02-svg-orange g#01-1_hiring300"), 
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

								$("#chapter-02-svg-orange g.municipalLayer").not(orangeLayer[index+1]).addClass("transparent_layer");
								$("#chapter-02-svg-red g.municipalLayer").not(redLayer[index+1]).addClass("transparent_layer");
								orangeLayer[index+1].removeClass("transparent_layer");
								redLayer[index+1].removeClass("transparent_layer");
								
								$("#layer-names div").eq(index).removeClass('orange-background').addClass('red-background');
								$("#layer-names div").eq(index+1).removeClass('red-background').addClass('orange-background');
								$("#layer-names div").eq(index+2).removeClass('orange-background');

								console.log("chapter-02-pageChange-0"+index);
							}
							$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( $(this), changeLayer_02, function() {} )); // 트리거가 일시적으로 작동 
							$(window).on('scroll', onUnderBottomOfViewport( $(this), changeLayer_02, function(){} ));
						})
					});
			});


		d3.text("@images/svg_maps/02_cumulative-red-maps/02-8_expertRate_geographic.svg").then( function(map_svg_imported) {
			$("#chapter-03-svg").html(map_svg_imported);
			$("#chapter-03 div.page").each( function(index) {
				var changeLayer_03 = function() {
					var colorMunicipal = [ $("#chapter-03-svg g#02-8_expertRate_geographic #Gokseong"), 
											$("#chapter-03-svg g#02-8_expertRate_geographic #Ulsan_dong, #chapter-03-svg g#02-8_expertRate_geographic #Ulsan_buk"), 
											$("#chapter-03-svg g#02-8_expertRate_geographic #Gunsan"), 
											$("#chapter-03-svg g#02-8_expertRate_geographic #Suwon"), 
											$("#chapter-03-svg g#02-8_expertRate_geographic #Paju"), 
											$("#chapter-03-svg g#02-8_expertRate_geographic .municipalShape") ];
					$("#chapter-03-svg g#02-8_expertRate_geographic .municipalShape").not(colorMunicipal[index]).addClass("transparent_shape");
					colorMunicipal[index].removeClass("transparent_shape");
					console.log("chapter-03-pageChange-0"+index);
				}
				$(window).on('DOMContentLoaded load resize scroll', onAboveBottomOfViewport( $(this), changeLayer_03, function() {} )); // 트리거가 일시적으로 작동 
				$(window).on('scroll', onUnderBottomOfViewport( $(this), changeLayer_03, function(){} ));
			})
		});
		

	});

	// $(window).on("resize", resizeWindow); // 창 크기가 바뀔 때에는 resizeWindow() 가동

})(jQuery);

