function analyzeAudio(bufferLength, analyser) {

    function draw() {
        var visualization = document.getElementById("visualization");
        var canvasCtx = visualization.getContext('2d');
        var WIDTH = visualization.width;
        var HEIGHT = visualization.height;
        drawVisual = requestAnimationFrame(draw);
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(visualization.width, visualization.height / 2);
        canvasCtx.stroke();
    };
    draw();
}

function stopVisualization() {
    var visualization = document.getElementById("visualization");
    var canvasCtx = visualization.getContext('2d');
    var WIDTH = visualization.width;
    var HEIGHT = visualization.height;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
}
