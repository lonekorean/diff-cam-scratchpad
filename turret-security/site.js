var video = $('video')[0];
var $motionBox = $('.motion-box');
var $turret = $('img');

var scale = 10;	// capture resolution over motion resolution
var isTargetLost = true;
var isKilled = false;

var lostTimeout;

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function startComplete() {
	play('activated');
}

function capture(payload) {
	if (isKilled) {
		return;
	}

	var box = payload.motionBox;
	if (box) {
		var left = box.x.min * scale + 1;
		var top = box.y.min * scale + 1;
		var width = (box.x.max - box.x.min) * scale;
		var height = (box.y.max - box.y.min) * scale;

		$motionBox.css({
			display: 'block',
			left: left,
			top: top,
			width: width,
			height: height
		});

		if (isTargetLost) {
			play('i-see-you');
			isTargetLost = false;
		} else {
			play('fire');
		}
		clearTimeout(lostTimeout);
		lostTimeout = setTimeout(declareLost, 2000);
	}

	if (payload.checkMotionPixel(0, 0)) {
		killTurret();
	}
}

function play(audioId) {
	$('#audio-' + audioId)[0].play();
	console.log(audioId);
}

function declareLost() {
	play('target-lost');
	isTargetLost = true;
}

function killTurret() {
	isKilled = true;
	clearTimeout(lostTimeout);
	$motionBox.hide();
	$turret.addClass('killed');
	play('ow');
}

DiffCamEngine.init({
	video: video,
	includeMotionBox: true,
	includeMotionPixels: true,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	startCompleteCallback: startComplete,
	captureCallback: capture
});
