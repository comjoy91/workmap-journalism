var _industry_income = [
	{ "industry": "전기, 가스, 증기 및 수도사업", 			"incomeRate": 1.95864964113669, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "제조업 (300인 이상)", 				"incomeRate": 1.83973391476591, "fill_colour": "hsla(0, 100%, 75%, 1.0)", "font_weight": 700 },
	{ "industry": "금융 및 보험업", 					"incomeRate": 1.7794718210598, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "전문, 과학 및 기술서비스업", 			"incomeRate": 1.40071697821374, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "출판, 영상, 방송통신 및 정보서비스업", 	"incomeRate": 1.28549622176929, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "광업", 							"incomeRate": 1.15798810774132, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "제조업 (전체)", 						"incomeRate": 1.15072259129997, "fill_colour": "#6699cc", "font_weight": 700 },
	{ "industry": "교육서비스업", 						"incomeRate": 1.03391489064461, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "운수업", 							"incomeRate": 0.984161429865111, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "하수·폐기물처리, 원료재생 및 환경복원업",	"incomeRate": 0.963201854064748, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "도매 및 소매업", 					"incomeRate": 0.95072489890208, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "보건업 및 사회복지서비스업", 			"incomeRate": 0.832789591591846, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "건설업", 							"incomeRate": 0.818317496114497, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "예술, 스포츠 및 여가관련서비스업", 		"incomeRate": 0.783466467422895, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "부동산업 및 임대업", 					"incomeRate": 0.762846795177236, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "협회 및 단체, 수리 및 기타 개인서비스업", 	"incomeRate": 0.698517708663362, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "사업시설관리 및 사업지원서비스업", 		"incomeRate": 0.651210306125249, "fill_colour": "#6699cc", "font_weight": 400 },
	{ "industry": "숙박 및 음식점업", 					"incomeRate": 0.506941516630951, "fill_colour": "#6699cc", "font_weight": 400 }
];

_industry_income.sort(function(a, b){return b.incomeRate - a.incomeRate});


var _national_jobCreation = [
	{ "nation": "Austria", 			"low-skill-colour": 3.00, "middle-skill-colour": -16.80, "high-skill-colour": 13.80, "font_weight": 400 }, 
	{ "nation": "Switzerland", 		"low-skill-colour": -0.01, "middle-skill-colour": -15.56, "high-skill-colour": 15.57, "font_weight": 400 }, 
	{ "nation": "Ireland", 			"low-skill-colour": 0.71, "middle-skill-colour": -15.1, "high-skill-colour": 14.4, "font_weight": 400 }, 
	{ "nation": "Spain", 			"low-skill-colour": 3.39, "middle-skill-colour": -13.6, "high-skill-colour": 10.2, "font_weight": 400 }, 
	{ "nation": "Greece", 			"low-skill-colour": 8.67, "middle-skill-colour": -13.2, "high-skill-colour": 4.51, "font_weight": 400 }, 
	{ "nation": "Denmark", 			"low-skill-colour": 4.48, "middle-skill-colour": -12.7, "high-skill-colour": 8.23, "font_weight": 400 }, 
	{ "nation": "France", 			"low-skill-colour": 4.12, "middle-skill-colour": -12.1, "high-skill-colour": 7.99, "font_weight": 400 }, 
	{ "nation": "Sweden", 			"low-skill-colour": 2.96, "middle-skill-colour": -11.0, "high-skill-colour": 8.02, "font_weight": 400 }, 
	{ "nation": "Portugal", 		"low-skill-colour": 2.73, "middle-skill-colour": -10.7, "high-skill-colour": 8.02, "font_weight": 400 }, 
	{ "nation": "United Kingdom", 	"low-skill-colour": 1.12, "middle-skill-colour": -10.2, "high-skill-colour": 9.12, "font_weight": 400 }, 
	{ "nation": "Norway", 			"low-skill-colour": 3.92, "middle-skill-colour": -10.0, "high-skill-colour": 6.12, "font_weight": 400 }, 
	{ "nation": "Netherlands", 		"low-skill-colour": 4.21, "middle-skill-colour": -9.74, "high-skill-colour": 5.53, "font_weight": 400 }, 
	{ "nation": "Finland", 			"low-skill-colour": 0.77, "middle-skill-colour": -9.71, "high-skill-colour": 8.94, "font_weight": 400 }, 
	{ "nation": "OECD 전체", 			"low-skill-colour": 1.93, "middle-skill-colour": -9.52, "high-skill-colour": 7.60, "font_weight": 700 }, 
	{ "nation": "Italy", 			"low-skill-colour": 4.55, "middle-skill-colour": -9.33, "high-skill-colour": 4.78, "font_weight": 400 }, 
	{ "nation": "Germany", 			"low-skill-colour": 3.42, "middle-skill-colour": -8.16, "high-skill-colour": 4.74, "font_weight": 400 }, 
	{ "nation": "Belgium", 			"low-skill-colour": 1.35, "middle-skill-colour": -7.33, "high-skill-colour": 5.98, "font_weight": 400 }, 
	{ "nation": "United States", 	"low-skill-colour": 1.23, "middle-skill-colour": -6.56, "high-skill-colour": 5.33, "font_weight": 400 }, 
	{ "nation": "Slovenia", 		"low-skill-colour": -2.26, "middle-skill-colour": -6.50, "high-skill-colour": 8.80, "font_weight": 400 }, 
	{ "nation": "Canada", 			"low-skill-colour": 1.83, "middle-skill-colour": -6.15, "high-skill-colour": 4.32, "font_weight": 400 }, 
	{ "nation": "Slovak Republic", 	"low-skill-colour": 0.87, "middle-skill-colour": -5.39, "high-skill-colour": 4.52, "font_weight": 400 }, 
	{ "nation": "Japan", 			"low-skill-colour": 2.64, "middle-skill-colour": -5.18, "high-skill-colour": 2.54, "font_weight": 400}, 
	{ "nation": "Hungary", 			"low-skill-colour": -5.04, "middle-skill-colour": -2.51, "high-skill-colour": 7.54, "font_weight": 400}, 
	{ "nation": "Czech Republic", 	"low-skill-colour": -5.01, "middle-skill-colour": -2.08, "high-skill-colour": 7.09, "font_weight": 400 }
];

_national_jobCreation.sort(function(a, b){return a["middle-skill-colour"] - b["middle-skill-colour"]});