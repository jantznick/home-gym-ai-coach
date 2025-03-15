setTimeout(() => {
	const downloadButton = document.createElement('button');
	downloadButton.innerText = 'Download API Schema';
	downloadButton.style.position = 'absolute';
	downloadButton.style.top = '10px';
	downloadButton.style.right = '10px';
	downloadButton.style.padding = '10px';
	downloadButton.style.backgroundColor = '#4CAF50';
	downloadButton.style.color = 'white';
	downloadButton.style.border = 'none';
	downloadButton.style.borderRadius = '5px';
	downloadButton.style.cursor = 'pointer';

	downloadButton.addEventListener('click', function () {
		const a = document.createElement('a');
		a.href = '/swagger.json';
		a.download = 'swagger.json';
		a.click();
	});

	console.log(document.getElementsByClassName('topbar-wrapper')[0])
	document.getElementsByClassName('topbar-wrapper')[0].appendChild(downloadButton);
}, 1000)