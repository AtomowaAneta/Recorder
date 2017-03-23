function initialize() {
    var record = document.querySelector(".record");
    var pause = document.querySelector(".pause");
    var stop = document.querySelector(".stop");
    var download = document.querySelector(".download");
    var chunks = [];
    var source;

    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    var bufferLength = analyser.fftSize;




    if (navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia) {
        var constraints = {
            audio: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                var mediaRecorder = new MediaRecorder(stream);

                source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);

                console.log("Ready to record");
                console.log(mediaRecorder.state);

                record.onclick = function() {
                    timeWatch();
                    mediaRecorder.start();
                    analyzeAudio(bufferLength, analyser);
                    console.log("recording in progress");
                    console.log(mediaRecorder.state);

                }

                pause.onclick = function() {

                }

                stop.onclick = function() {
                    freezeTime();
                    stopVisualization();
                    mediaRecorder.stop();
                    //  console.log("recording stopped");
                    console.log(mediaRecorder.state);
                }

                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                }

                mediaRecorder.onstop = function(e) {
                    console.log("recording stopped");
                    var clipRow = document.createElement('div');
                    var cols = document.createElement('div');
                    var cols1 = document.createElement('div');

                    var audio = document.createElement('audio');
                    var deleteButton = document.createElement('button');
                    var downloadButton = document.createElement('button');

                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-warning");
                    downloadButton.classList.add("btn");
                    downloadButton.classList.add("btn-info");
                    cols.classList.add("col-md-10");


                    cols1.classList.add("col-md-2");
                    cols1.classList.add("butt");
                    clipRow.classList.add("row");
                    clipRow.id = "record";
                    audio.setAttribute('controls', '');
                    deleteButton.innerHTML = "Delete";
                    downloadButton.innerHTML = "Download";

                    clipRow.appendChild(cols);
                    cols.appendChild(audio);

                    clipRow.appendChild(cols1);
                    cols1.appendChild(deleteButton);
                    cols1.appendChild(downloadButton);
                    recordings.appendChild(clipRow);



                    var blob = new Blob(chunks, {
                        'type': 'audio/mp3; codecs=opus'
                    });
                    chunks = [];
                    var audioURL = window.URL.createObjectURL(blob);
                    audio.src = audioURL;

                    deleteButton.onclick = function() {

                        var nodeList = document.getElementById("record");
                        nodeList.parentNode.removeChild(nodeList);
                        console.log("recording has been removed");

                    }

                    downloadButton.onclick = function() {
                        blobSaver(audioURL);
                        console.log("Audio has been downloaded");
                    }

                }

            }, printError);

    } else {
        console.log("Not supported");

    }

    function printError(e) {
        console.log('Failed', e);
    }

}