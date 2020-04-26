$(() => {
    // This code from https://bitly.com.vn/SOBHX
    // I just clone and modify
    const socket = io('http://localhost:4000');
    let playerTrack = $("#player-track");
    let bgArtwork = $('#bg-artwork');
    let bgArtworkUrl;
    let albumName = $('#album-name');
    let trackName = $('#track-name');
    let albumArt = $('#album-art');
    let sArea = $('#s-area');
    let seekBar = $('#seek-bar');
    let trackTime = $('#track-time');
    let insTime = $('#ins-time');
    let sHover = $('#s-hover');
    let playPauseButton = $("#play-pause-button");
    let i = playPauseButton.find('i');
    let tProgress = $('#current-time');
    let tTime = $('#track-length');
    let seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
        buffInterval = null, tFlag = false;
    let playPreviousTrackButton = $('#play-previous');
    let playNextTrackButton = $('#play-next');
    let currIndex = parseInt(trackID) - 1;

    const songs = [];
    socket.on('metaData', async (data) => {
        for (oneSong of data.allMetaData) {
            await songs.push(oneSong);
        }


        //  shuffle = (a) => {
        // 	let j, x, i;
        // 	for (i = a.length - 1; i > 0; i--) {
        // 		j = Math.floor(Math.random() * (i + 1));
        // 		x = a[i];
        // 		a[i] = a[j];
        // 		a[j] = x;
        // 	}
        // 	return a;
        // }
        // songs = shuffle(songs);

        playPause = () => {
            setTimeout(() => {
                if (audio.paused) {
                    // playerTrack.addClass('active');
                    albumArt.addClass('active');
                    checkBuffering();
                    i.attr('class', 'fas fa-pause');
                    audio.play();
                }
                else {
                    // playerTrack.removeClass('active');
                    albumArt.removeClass('active');
                    clearInterval(buffInterval);
                    albumArt.removeClass('buffering');
                    i.attr('class', 'fas fa-play');
                    audio.pause();
                }
            }, 300);
        }


        showHover = (event) => {
            seekBarPos = sArea.offset();
            seekT = event.clientX - seekBarPos.left;
            seekLoc = audio.duration * (seekT / sArea.outerWidth());

            sHover.width(seekT);

            cM = seekLoc / 60;

            ctMinutes = Math.floor(cM);
            ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

            if ((ctMinutes < 0) || (ctSeconds < 0))
                return;

            if ((ctMinutes < 0) || (ctSeconds < 0))
                return;

            if (ctMinutes < 10)
                ctMinutes = '0' + ctMinutes;
            if (ctSeconds < 10)
                ctSeconds = '0' + ctSeconds;

            if (isNaN(ctMinutes) || isNaN(ctSeconds))
                insTime.text('--:--');
            else
                insTime.text(ctMinutes + ':' + ctSeconds);

            insTime.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

        }

        hideHover = () => {
            sHover.width(0);
            insTime.text('00:00').css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
        }

        playFromClickedPos = () => {
            audio.currentTime = seekLoc;
            seekBar.width(seekT);
            hideHover();
        }

        updateCurrTime = () => {
            nTime = new Date();
            nTime = nTime.getTime();

            if (!tFlag) {
                tFlag = true;
                trackTime.addClass('active');
            }

            curMinutes = Math.floor(audio.currentTime / 60);
            curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

            durMinutes = Math.floor(audio.duration / 60);
            durSeconds = Math.floor(audio.duration - durMinutes * 60);

            playProgress = (audio.currentTime / audio.duration) * 100;

            if (curMinutes < 10) {
                curMinutes = '0' + curMinutes;
            }

            if (curSeconds < 10) {
                curSeconds = '0' + curSeconds;
            }

            if (durMinutes < 10) {
                durMinutes = '0' + durMinutes;
            }

            if (durSeconds < 10) {
                durSeconds = '0' + durSeconds;
            }

            if (isNaN(curMinutes) || isNaN(curSeconds)) {
                tProgress.text('00:00');
            }
            else {
                tProgress.text(curMinutes + ':' + curSeconds);
            }

            if (isNaN(durMinutes) || isNaN(durSeconds)) {
                tTime.text('00:00');
            }
            else {
                tTime.text(durMinutes + ':' + durSeconds);
            }

            if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds)) {
                trackTime.removeClass('active');

            }
            else {
                trackTime.addClass('active');
            }

            seekBar.width(playProgress + '%');

            if (playProgress == 100) {
                i.attr('class', 'fa fa-play');
                seekBar.width(0);
                tProgress.text('00:00');
                albumArt.removeClass('buffering').removeClass('active');
                clearInterval(buffInterval);
                selectTrack(1);
            }
        }

        checkBuffering = () => {
            clearInterval(buffInterval);
            buffInterval = setInterval(() => {
                if ((nTime == 0) || (bTime - nTime) > 1000)
                    albumArt.addClass('buffering');
                else
                    albumArt.removeClass('buffering');

                bTime = new Date();
                bTime = bTime.getTime();

            }, 100);
        }

        selectTrack = (flag) => {
            if (flag == 0)
                currIndex
            else if (flag == 1)
                currIndex++;
            else
                currIndex--;

            if ((currIndex > -1) && (currIndex < songs.length)) {
                if (flag == 0) {
                    i.attr('class', 'fa fa-pause');
                    audio.autoplay = true;
                }
                else {
                    albumArt.removeClass('buffering');
                    i.attr('class', 'fa fa-pause');
                }

                seekBar.width(0);
                trackTime.removeClass('active');
                tProgress.text('00:00');
                tTime.text('00:00');

                let pathImgFormat = songs[currIndex].picturedata.split("\\");
                let img = pathImgFormat[2];

                currAlbum = songs[currIndex].title;
                currTrackName = songs[currIndex].artist;
                currArtwork = '/uploadsImg/' + img;
                audio.src = '/uploads/' + songs[currIndex].filename;

                nTime = 0;
                bTime = new Date();
                bTime = bTime.getTime();
                if (flag != 0) {
                    audio.play();
                    playerTrack.addClass('active');
                    albumArt.addClass('active');

                    clearInterval(buffInterval);
                    checkBuffering();
                }

                albumName.text(currAlbum);
                trackName.text(currTrackName);
                albumArt.find('img').attr('src', currArtwork);

                $('#album-art img').prop('src', bgArtworkUrl);
            }
            else {
                if (flag == 0 || flag == 1)
                    --currIndex;
                else
                    ++currIndex;
            }
        }

        initPlayer = () => {
            audio = new Audio();

            selectTrack(0);

            audio.loop = false;
            // audio.autoplay = true;

            playPauseButton.on('click', playPause);

            sArea.mousemove((event) => { showHover(event); });

            sArea.mouseout(hideHover);

            sArea.on('click', playFromClickedPos);

            $(audio).on('timeupdate', updateCurrTime);

            playPreviousTrackButton.on('click', () => { selectTrack(-1); });
            playNextTrackButton.on('click', () => { selectTrack(1); });
        }

        initPlayer();


    })
});
