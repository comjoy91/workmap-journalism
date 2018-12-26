// ---------- function for getting "getBoundingClientRect()"
function getBound (el) {

	//special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	return el.getBoundingClientRect();
};





/* ------------ detecting if a div is FULLY visible in viewport ------------ */


function isElementFULLYInViewport (el) {
	var rect = getBound(el);
	return (
		rect.top >= 0 &&
		// rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) // && /*or $(window).height() */
		// rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	);
}
function isElementPartiallyInViewport (el) {
	var rect = getBound(el);
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.bottom >= 0 
	);
}
// function isElementAboveTopOfViewport (el) {
// 	var rect = getBound(el);
// 	return (
// 		rect.top <= 0
// 	);
// }
// function isElementUnderTopOfViewport (el) {
// 	var rect = getBound(el);
// 	return (
// 		rect.bottom >= 0
// 	);
// }
function isElementAboveBottomOfViewport (el) {
	var rect = getBound(el);
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight)
	);
}
function isElementUnderBottomOfViewport (el) {
	var rect = getBound(el);
	return (
		rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)
	);
}




function onPartiallyCoverViewport(el, callback_fullyCover, callback_notFullyCover) { // viewport의 일부를 가리는 순간/전혀 보이지 않는 순간, 발동.
	var old_cover=null; // 처음 onLoad할 때에 무조건 발동되게 함.
	return function () {
		var cover = isElementPartiallyInViewport(el);
		if (cover != old_cover) {
			old_cover = cover;
			if (cover && typeof callback_fullyCover == 'function') {
				callback_fullyCover();
			}
			else if (!cover && typeof callback_notFullyCover == 'function') {
				callback_notFullyCover();
			}
		}
	}
}

// function onUnderTopOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최상단보다 아래쪽으로 살짝만 뻗어나오면/완전히 최상단 위쪽으로 올라가버리면, 발동.
// 	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
// 	return function () {
// 		var cover = isElementUnderTopOfViewport(el);
// 		if (cover != old_cover) {
// 			old_cover = cover;
// 			if (cover && typeof callback_fullyCover == 'function') {
// 				callback_fullyCover();
// 			}
// 			else if (!cover && typeof callback_notFullyCover == 'function') {
// 				callback_notFullyCover();
// 			}
// 		}
// 	}
// }

// function onAboveTopOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최상단보다 위쪽으로 살짝만 뻗어나오면/완전히 최상단 아래로 내려가버리면, 발동.
// 	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
// 	return function () {
// 		var cover = isElementAboveTopOfViewport(el);
// 		if (cover != old_cover) {
// 			old_cover = cover;
// 			if (cover && typeof callback_fullyCover == 'function') {
// 				callback_fullyCover();
// 			}
// 			else if (!cover && typeof callback_notFullyCover == 'function') {
// 				callback_notFullyCover();
// 			}
// 		}
// 	}
// }

function onUnderBottomOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최하단보다 아래쪽으로 살짝만 뻗어나오면/완전히 최하단 위쪽으로 올라가버리면, 발동.
	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
	return function () {
		var cover = isElementUnderBottomOfViewport(el);
		if (cover != old_cover) {
			old_cover = cover;
			if (cover && typeof callback_fullyCover == 'function') {
				callback_fullyCover();
			}
			else if (!cover && typeof callback_notFullyCover == 'function') {
				callback_notFullyCover();
			}
		}
	}
}

function onAboveBottomOfViewport(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최하단보다 위쪽으로 살짝만 뻗어나오면/완전히 최하단 아래로 내려가버리면, 발동.
	var old_cover=true; // 처음 onLoad할 때에, cover=true면 callback이 없도록 함.
	return function () {
		var cover = isElementAboveBottomOfViewport(el);
		if (cover != old_cover) {
			old_cover = cover;
			if (cover && typeof callback_fullyCover == 'function') {
				callback_fullyCover();
			}
			else if (!cover && typeof callback_notFullyCover == 'function') {
				callback_notFullyCover();
			}
		}
	}
}

function onAboveBottomOfViewport_initial(el, callback_fullyCover, callback_notFullyCover) { // el이 viewport 최하단보다 위쪽으로 살짝만 뻗어나오면/완전히 최하단 아래로 내려가버리면, 발동.
	var old_cover; // 처음 onLoad할 때에도 무조건 callback이 일어나게 함.
	return function () {
		var cover = isElementAboveBottomOfViewport(el);
		if (cover != old_cover) {
			old_cover = cover;
			if (cover && typeof callback_fullyCover == 'function') {
				callback_fullyCover();
			}
			else if (!cover && typeof callback_notFullyCover == 'function') {
				callback_notFullyCover();
			}
		}
	}
}




