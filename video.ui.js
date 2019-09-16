function onYouTubeIframeAPIReady() {
    for (var a = 0; a < vdosLeng; a++)
        VideoSetting(a)
}
function VideoSetting(a) {
    var b = youtubeVdoArray[a].yId
      , c = youtubeVdoArray[a].yOpt
      , e = youtubeVdoArray[a].vCc;
    if (void 0 == $("#" + b).prop("tagName") || "iframe" != $("#" + b).prop("tagName").toLowerCase()) {
        if ("10" == e) {
            var d = document.createElement("iframe");
            d.setAttribute("name", b);
            d.setAttribute("id", b);
            d.setAttribute("frameborder", "0");
            d.setAttribute("width", c.width);
            d.setAttribute("height", c.height);
            d.setAttribute("allowfullscreen", "");
            d.src = "//play.wecandeo.com/video/v/?key\x3d" + c.videoId;
            $("#" + b).parent().html(d);
            d = document.getElementById(b);
            playerArr[a] = new smIframeAPI(d.contentWindow || d.contentDocument);
            playerArr[a].onEvent(smIframeEvent.PLAY, function() {
                console.log("wecandeo play idx:" + a);
                console.log(playerArr[a])
            });
            playerArr[a].onEvent(smIframeEvent.IDLE, function() {
                console.log("wecandeo stop idx:" + a);
                console.log(playerArr[a])
            });
            playerArr[a].onEvent(smIframeEvent.PAUSE, function() {
                console.log("wecandeo pause idx:" + a);
                console.log(playerArr[a])
            })
        }
        "20" == e && (playerArr[a] = new YT.Player(b,{
            width: c.width,
            height: c.height,
            videoId: c.videoId,
            playerVars: {
                controls: 0,
                playsinline: 1,
                showinfo: 0,
                modestbranding: 0,
                rel: 0
            },
            events: {
                onStateChange: onPlayerStateChange
            }
        }))
    }
}
function onPlayerStateChange(a) {
    playerState = a.data == YT.PlayerState.ENDED ? "종료됨" : a.data == YT.PlayerState.PLAYING ? "재생 중" : a.data == YT.PlayerState.PAUSED ? "일시중지 됨" : a.data == YT.PlayerState.BUFFERING ? "버퍼링 중" : a.data == YT.PlayerState.CUED ? "재생준비 완료됨" : -1 == a.data ? "시작되지 않음" : "예외";
    "종료됨" == playerState && $(a.target.a).parents(".set_vdo").find(".btn_vdo_play").show()
}
function playYoutube(a) {
    for (var b = 0; b < vdosLeng; b++)
        vdoCurrentIDX != a && stopYoutube(b);
    var c = $("#" + youtubeVdoArray[a].yId).parents(".set_vdo")
      , b = c.find(".btn_vdo_play")
      , c = c.find(".btn_vdo_pause");
    b.hide();
    c.css("display", "block");
    c.on("click", function() {
        actionPause(a)
    });
    playerArr[a].playVideo();
    vdoCurrentIDX = a
}
function actionPause(a) {
    var b = youtubeVdoArray[a].vCc;
    "10" == b && (console.log("Wecandeo Pause"),
    playerArr[a].pause());
    if ("20" == b) {
        var c = $("#" + youtubeVdoArray[a].yId).parents(".set_vdo")
          , b = c.find(".btn_vdo_play")
          , c = c.find(".btn_vdo_pause");
        playerArr[a].pauseVideo();
        c.hide();
        b.show()
    }
}
function actionStop(a) {
    var b = youtubeVdoArray[a].vCc;
    "10" == b && (console.log("Wecandeo Stop"),
    playerArr[a].stop());
    if ("20" == b) {
        b = $("#" + youtubeVdoArray[a].yId);
        console.log(b);
        var c = b.parents(".set_vdo")
          , b = c.find(".btn_vdo_play")
          , c = c.find(".btn_vdo_pause");
        playerArr[a].seekTo(0, !0);
        playerArr[a].stopVideo();
        c.hide();
        b.show()
    }
}
function pauseYoutube(a) {
    actionPause(a)
}
function stopYoutube(a) {
    actionStop(a)
}
;