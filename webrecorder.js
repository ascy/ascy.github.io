//(function () {
//    'use strict';

if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
}

if (!window.AudioContext) {
    window.AudioContext = window.webkitAudioContext || window.mozAudioContext;
}

var audioContext = new AudioContext(),
    inputNode,
    gainNode,
    recorderNode;

function setupAudioNodes(stream) {
    inputNode = audioContext.createMediaStreamSource(stream);

    gainNode = audioContext.createGain();

    inputNode.connect(gainNode);

    gainNode.connect(audioContext.destination);
}

function initAudio() {

    navigator.getUserMedia({ audio: true }, setupAudioNodes, function () {
        alert("getUserMedia() failed");
    });
}


window.onload = function () {
    initAudio();
};
//}());