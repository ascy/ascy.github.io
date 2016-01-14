'use strict';

function format_time(seconds) {
    var h = Math.floor(seconds / 3600),
        m = Math.floor((seconds % 3600) / 60),
        s = (seconds % 60).toFixed(2),
        ms = (m < 10 ? "0" + m : m),
        ss = (s < 10 ? "0" + s : s);
    
    if (h > 0)
        return h + ":" + ms + ":" + ss;
    else if (m > 0)
        return ms + ":" + ss;
    else
        return ss;
}

window.onload = function () {
    var audio_file = document.getElementById("audio_file"),
        A_button = document.getElementById("A_button"),
        B_button = document.getElementById("B_button"),
        A_display = document.getElementById("A_display"),
        B_display = document.getElementById("B_display"),
        play_rate = document.getElementById("play_rate"),
        play_rate_display = document.getElementById("play_rate_display"),
        audio_player = document.getElementById("audio_player"),
        a = 0.0,
        b = 0.0;
    
    
    audio_file.onchange = function() {
        var url = URL.createObjectURL(this.files[0]);
        audio_player.src = url;
        a = -1;
        b = -1;
    };
    
    A_button.onclick = function() {
        if (audio_player.currentTime === a)
            a = -1;
        else
            a = audio_player.currentTime;
        
        A_display.value = a < 0 ? "" : format_time(a);
    }
    
    B_button.onclick = function() {
        if (audio_player.currentTime === b)
            b = -1;
        else
            b = audio_player.currentTime;
        
        B_display.value = b < 0 ? "" : format_time(b);
    }
    
    play_rate.oninput = function() {
        play_rate_display.value = play_rate.value;
        audio_player.playbackRate = play_rate.value;
    };
    
    audio_player.ontimeupdate = function() {
        if (b > 0.0 && audio_player.currentTime >= b) {
            if (a >= 0.0)
                audio_player.currentTime = a;
            else
                audio_player.currentTime = 0;
        }
    };
};
