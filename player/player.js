'use strict';
/*
if (!window.AudioContext) {
    window.AudioContext = window.webkitAudioContext || window.mozAudioContext;
}

var audioContext = new AudioContext(),
    audioBuffer = null,
    sourceNode = null,
    gainNode = null,
    speed = 1.0;

function initAudio() {
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
}

function loadAudio(arrayBuffer, onfinish) {
    audioBuffer = audioContext.decodeAudioData(arrayBuffer, function(buffer) {
        audioBuffer = buffer;
        onfinish();
    });
    sourceNode = null;
}

function stopAudio() {
    if (sourceNode === null) return;
    sourceNode.stop();
    sourceNode.disconnect();
    sourceNode = null;
}

function playAudio() {
    if (audioBuffer === null) return;
    
    stopAudio();
    
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);
    
    changeSpeed(speed);
    
    sourceNode.start();
}

function changeSpeed(val)
{
    speed = val;
    if (sourceNode === null) return;
    sourceNode.playbackRate.value = speed;
}

function changeVolume(val)
{
    gainNode.gain.value = val;
}

window.onload = function () {
    initAudio();
    var audio_file = document.getElementById("audio_file"),
        play_button = document.getElementById("play_button"),
        pause_button = document.getElementById("pause_button"),
        stop_button = document.getElementById("stop_button"),
        play_rate = document.getElementById("play_rate"),
        play_rate_display = document.getElementById("play_rate_display"),
        audio_player = document.getElementById("audio_player"),
        enableButtons = function(value) {
            play_button.disabled = !value;
            pause_button.disabled = !value;
            stop_button.disabled = !value;
        };
    
    enableButtons(false);
    
    audio_file.onchange = function() {
        var url = URL.createObjectURL(this.files[0]);
        audio_player.src = url;
    };
    
    play_button.onclick = playAudio;
    
    stop_button.onclick = stopAudio;
    
    play_rate.oninput = function() {
        changeSpeed(play_rate.value);
        play_rate_display.value = play_rate.value;
    }
};
*/

window.onload = function () {
    var audio_file = document.getElementById("audio_file"),
        play_button = document.getElementById("play_button"),
        pause_button = document.getElementById("pause_button"),
        stop_button = document.getElementById("stop_button"),
        play_rate = document.getElementById("play_rate"),
        play_rate_display = document.getElementById("play_rate_display"),
        audio_player = document.getElementById("audio_player");
    
    
    audio_file.onchange = function() {
        var url = URL.createObjectURL(this.files[0]);
        audio_player.src = url;
    };
    
//    play_button.onclick = function() {
//        audio_player.play();
//    };
//    
//    stop_button.onclick = stopAudio;
    
    play_rate.oninput = function() {
//        changeSpeed(play_rate.value);
        play_rate_display.value = play_rate.value;
        audio_player.playbackRate = play_rate.value;
    }
};
