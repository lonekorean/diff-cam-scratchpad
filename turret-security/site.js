var video = $('video')[0];
var $motionBox = $('.motion-box');
var $turret = $('img');

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function capture(payload) {
	var box = payload.motionBox;
	if (box) {
		var left = box.x.min;
		var top = box.y.min;
		var width = box.x.max - box.x.min;
		var height = box.y.max - box.y.min;

		$motionBox.css({
			display: 'block',
			left: left,
			top: top,
			width: width,
			height: height
		});

		// the extra width/height checks weed out full frame motion
		// caused by a webcam's initial lighting adjustment
		if (left < 140 && top < 80 && width < 639 && height < 479) {
			killTurret();
		}
	}
}

function killTurret() {
	$turret.addClass('kill');
	$('#audio-ow')[0].play();
}

DiffCamEngine.init({
	video: video,
	diffWidth: 640,
	diffHeight: 480,
	pixelDiffThreshold: 50,
	scoreThreshold: 500,
	includeMotionBox: true,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	captureCallback: capture
});
