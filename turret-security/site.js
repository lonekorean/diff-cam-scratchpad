var $motionBox = $('.motion-box');
var $turret = $('img');

var scale = 10;	// capture resolution over motion resolution
var isActivated = false;
var isTargetInSight = false;
var isKnockedOver = false;
var lostTimeout;

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function startComplete() {
	setTimeout(activate, 500);
}

function activate() {
	isActivated = true;
	play('activated');
}

function capture(payload) {
	if (!isActivated || isKnockedOver) {
		return;
	}

	var box = payload.motionBox;
	if (box) {
		// video is flipped, so we're positioning from right instead of left
		var right = box.x.min * scale + 1;
		var top = box.y.min * scale + 1;
		var width = (box.x.max - box.x.min) * scale;
		var height = (box.y.max - box.y.min) * scale;

		$motionBox.css({
			display: 'block',
			right: right,
			top: top,
			width: width,
			height: height
		});

		if (!isTargetInSight) {
			isTargetInSight = true;
			play('i-see-you');
		} else {
			play('fire');
		}

		clearTimeout(lostTimeout);
		lostTimeout = setTimeout(declareLost, 2000);
	}

	// video is flipped, so (0, 0) is at top right
	if (payload.checkMotionPixel(0, 0)) {
		knockOver();
	}
}

function declareLost() {
	isTargetInSight = false;
	play('target-lost');
}

function knockOver() {
	isKnockedOver = true;
	clearTimeout(lostTimeout);

	$turret.addClass('knocked-over');
	$motionBox.hide();

	play('ow');
}

function play(audioId) {
	$('#audio-' + audioId)[0].play();
}

DiffCamEngine.init({
	video: document.getElementById('video'),
	pixelDiffThreshold: 16,
	includeMotionBox: true,
	includeMotionPixels: true,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	startCompleteCallback: startComplete,
	captureCallback: capture
});
