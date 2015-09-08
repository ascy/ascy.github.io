'use strict';

if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
}

if (!window.AudioContext) {
    window.AudioContext = window.webkitAudioContext || window.mozAudioContext;
}

var audioContext = new AudioContext(),
    inputNode,
    gainNode,
    recorderNode,
    recording = false,
    bypassing = true,
    rec_l = null,
    rec_r = null,
    rec_len = 0;

function processor(e) {
    var inbuf_l,
        inbuf_r,
        outbuf_l,
        outbuf_r,
        old_buf,
        len = e.inputBuffer.length;
    
    inbuf_l = e.inputBuffer.getChannelData(0);
    outbuf_l = e.outputBuffer.getChannelData(0);
    inbuf_r = e.inputBuffer.getChannelData(1);
    outbuf_r = e.outputBuffer.getChannelData(1);
    
    if (recording) {
        old_buf = rec_l;
        rec_l = new Float32Array(rec_len + len);
        if (rec_len != 0) {
            rec_l.set(old_buf, 0);
        }
        rec_l.set(inbuf_l, rec_len);
        
        old_buf = rec_r;
        rec_r = new Float32Array(rec_len + len);
        if (rec_len != 0) {
            rec_r.set(old_buf, 0);
        }
        rec_r.set(inbuf_r, rec_len);
        
        rec_len += len;
    }
    
    if (bypassing) {
        for (var i = 0; i < len; i++) {
            outbuf_l[i] = inbuf_l[i];
            outbuf_r[i] = inbuf_r[i];
        }
    } else {
        for (var i = 0; i < len; i++) {
            outbuf_l[i] = 0.0;
            outbuf_r[i] = 0.0;
        }
    }
}

function setupAudioNodes(stream) {
    inputNode = audioContext.createMediaStreamSource(stream);

    gainNode = audioContext.createGain();

    inputNode.connect(gainNode);
    
    recorderNode = audioContext.createScriptProcessor(1024, 2, 2);
    recorderNode.onaudioprocess = processor;
    
    gainNode.connect(recorderNode);
    
    recorderNode.connect(audioContext.destination);
}

function initAudio() {

    navigator.getUserMedia({
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, setupAudioNodes, function () {
        alert("getUserMedia() failed");
    });
}

function beginRecord() {
    rec_l = null;
    rec_r = null;
    rec_len = 0;
    recording = true;
}

function endRecord() {
    recording = false;
    playRecord();
}

function playRecord() {
    if (rec_len == 0) return;
    
    var audio_buffer = audioContext.createBuffer(2, rec_len, audioContext.sampleRate),
        audio_node;
    audio_buffer.getChannelData(0).set(rec_l, 0);
    audio_buffer.getChannelData(1).set(rec_r, 0);
    
    audio_node = audioContext.createBufferSource();
    audio_node.buffer = audio_buffer;
    audio_node.connect(recorderNode);
    
    audio_node.start();
}

window.onload = function () {
    initAudio();
    var record_button = document.getElementById("record_button"),
        playback_button = document.getElementById("playback_button");
    record_button.onmousedown = beginRecord;
    record_button.onmouseup = endRecord;
    
    playback_button.onclick = playRecord;
};
