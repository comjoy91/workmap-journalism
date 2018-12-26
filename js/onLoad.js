
// ---------- BACKGROUND MAP LAYER ----------

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
var attribution_01 = L.control.attribution({position: 'topright'}).addTo(map_01);
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
var attribution_03 = L.control.attribution({position: 'topright'}).addTo(map_03);
// L.control.zoom({position: 'topleft'}).addTo(map);


var layer_province_border_01 = L.geoJson(provinceGeoJSON, {
	style: {
		opacity: 0, 
		fillOpacity: 0,
		weight: 1.4
	},
	smoothFactor: 0, 
	interactive: false
}).addTo(map_01);
var layer_province_border_03 = L.geoJson(provinceGeoJSON, {
	style: {
		opacity: 0, 
		fillOpacity: 0,
		weight: 1.4
	},
	smoothFactor: 0, 
	interactive: false
}).addTo(map_03);



// ---------- D3 tooltips ----------


var tooltip_orange = d3.select("#tooltip-orange");
var tooltip_red = d3.select("#tooltip-red");


// ---------- FUNCTIONS AND TRIGGERS ----------


var handler_chapter_01_1 = onAboveBottomOfViewport_initial( $("#chapter-01"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-01-background").addClass("visible");
															console.log("chapter-01");
														}, 
														function() {}
													);
var handler_chapter_01_2 = onUnderBottomOfViewport( $("#chapter-01"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-01-background").addClass("visible");
															console.log("chapter-01");
														}, 
														function() {}
													);

var handler_chapter_02_1 = onAboveBottomOfViewport_initial( $("#chapter-02"),  
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-02-background").addClass("visible");
															console.log("chapter-02");
														}, 
														function() {}
													);
var handler_chapter_02_2 = onUnderBottomOfViewport( $("#chapter-02"),  
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-02-background").addClass("visible");
															console.log("chapter-02");
														}, 
														function() {}
													);

var handler_chapter_03_1 = onAboveBottomOfViewport_initial( $("#chapter-03"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-03-background").addClass("visible");
															$("#layer-names div").removeClass('orange-background').addClass('red-background');
															console.log("chapter-03");
														}, 
														function() {}
													);
var handler_chapter_03_2 = onUnderBottomOfViewport( $("#chapter-03"), 
														function() {
															$(".fixed-background").removeClass("visible");
															$("#chapter-03-background").addClass("visible");
															$("#layer-names div").removeClass('orange-background').addClass('red-background');
															console.log("chapter-03");
														}, 
														function() {}
													);

function leaflet_resize() {
	var windowWidth, windowHeight, wideRatio = 0;
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	wideRatio = windowWidth / windowHeight;

	{ // initial map view setting by different browser window width.
		if ( windowWidth >= 1024 ) {
			map_01.setView([35.95, 125.5], 7.3);
			map_03.setView([35.95, 125.5], 7.3);
		}
		else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
			map_01.setView([36, 125.5], 6);
			map_03.setView([36, 125.5], 6);
		}
		else if ( windowWidth >= 768 ) {
			map_01.setView([35.95, 127.6], 7.3);
			map_03.setView([35.95, 127.6], 7.3);
		}
		else if ( wideRatio > 1/1 ) { 
			map_01.setView([36, 125.5], 6);
			map_03.setView([36, 125.5], 6);
		}
		else { 
			map_01.setView([35.95, 127.6], 6.5);
			map_03.setView([35.95, 127.6], 6.5);
		}
	}
}

map_01.on("zoomend moveend", function(_event) {
	var mapSvgBound_01 = layer_province_border_01.getBounds();
	var mapSvgNW_01 = map_01.latLngToContainerPoint(mapSvgBound_01.getNorthWest());
	var mapSvgSE_01 = map_01.latLngToContainerPoint(mapSvgBound_01.getSouthEast());
	var mapSvgWidth_01 = mapSvgSE_01.x - mapSvgNW_01.x;
	var mapSvgLeft_01 = mapSvgNW_01.x;
	var mapSvgTop_01 = mapSvgNW_01.y;
	$("#chapter-01-svg").width( mapSvgWidth_01 ).css( { top: mapSvgTop_01+'px', left: mapSvgLeft_01+'px' } );
});

map_03.on("zoomend moveend", function(_event) {
	var mapSvgBound_03 = layer_province_border_03.getBounds();
	var mapSvgNW_03 = map_03.latLngToContainerPoint(mapSvgBound_03.getNorthWest());
	var mapSvgSE_03 = map_03.latLngToContainerPoint(mapSvgBound_03.getSouthEast());
	var mapSvgWidth_03 = mapSvgSE_03.x - mapSvgNW_03.x;
	var mapSvgLeft_03 = mapSvgNW_03.x;
	var mapSvgTop_03 = mapSvgNW_03.y;
	$("#chapter-03-svg").width( mapSvgWidth_03 ).css( { top: mapSvgTop_03+'px', left: mapSvgLeft_03+'px' } );	
});

function resizeMap_chapter_01_03() {

	
}




//jQuery
$(window).on('DOMContentLoaded load orientationchange resize scroll', handler_chapter_01_1)
			.on('DOMContentLoaded load orientationchange resize scroll', handler_chapter_02_1)
			.on('DOMContentLoaded load orientationchange resize scroll', handler_chapter_03_1)
			.on('orientationchange resize scroll', handler_chapter_01_2)
			.on('orientationchange resize scroll', handler_chapter_02_2)
			.on('orientationchange resize scroll', handler_chapter_03_2)
			.on('DOMContentLoaded load', leaflet_resize); // resize & orientationchange event에 대해서는 아래에서 처리.
map_01.on("resize", function(e) {
	leaflet_resize();
});

