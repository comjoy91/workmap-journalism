
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