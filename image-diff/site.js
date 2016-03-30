$(function() {
	var canvas = $('canvas')[0];
	var img1 = $('#img1')[0];
	var img2 = $('#img2')[0];

	//
	// Drag/drop code below...
	//

	$('.drop-zone')
		.on('dragover', dragOver)
		.on('dragleave', dragLeave)
		.on('drop', drop);
	$('.drop-zone img').on('load', checkReady);
	$('#raw').on('click', rawDiff);
	$('#mono').on('click', monoDiff);

	function dragOver() {
		$(this).addClass('drop-over');
		return false;
	}

	function dragLeave() {
		$(this).removeClass('drop-over');
		return false;
	}

	function drop(e) {
		$(this).removeClass('drop-over');
		var file = e.originalEvent.dataTransfer.files[0];
		var targetImg = $(this).find('img')[0];
		load(file, targetImg);
		e.preventDefault();
		return false;
	}

	function load(file, targetImg) {
		if (!file || file.type.indexOf('image/') !== 0) {
			alert('Not an image!');
		} else {
			var reader = new FileReader();
			reader.onload = setLoaded.bind(null, targetImg);
			reader.readAsDataURL(file);
		}
	}

	function setLoaded(targetImg, e) {
		targetImg.src = e.target.result;
	}

	function checkReady() {
		if (img1.src && img2.src) {
			canvas.width = Math.max(img1.naturalWidth, img2.naturalWidth);
			canvas.height = Math.max(img1.naturalHeight, img2.naturalHeight);
			canvas.getContext('2d').globalCompositeOperation = 'difference';

			$('button').prop('disabled', false);
		}
	}

	//
	// Diffing code below...
	//

	function rawDiff() {
		canvas.style.display = 'inline-block';

		var context = canvas.getContext('2d');
		context.globalCompositeOperation = 'difference';

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img1, 0, 0);
		context.drawImage(img2, 0, 0);
	}

	function monoDiff() {
		rawDiff();

		var context = canvas.getContext('2d');

		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var rgba = imageData.data;

		for (var i = 0; i < rgba.length; i += 4) {
			var pixelDiff = rgba[i] * 0.3 + rgba[i + 1] * 0.6 + rgba[i + 2] * 0.1;
			rgba[i] = 0;
			rgba[i + 1] = pixelDiff;
			rgba[i + 2] = 0;
		}

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.putImageData(imageData, 0, 0);
	}
});
