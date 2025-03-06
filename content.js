let mediaTitle = "";
let mediaArtist = "";
let mediaAlbum = "";
let mediaArtworkSrc = "";
let mediaArtworkSizes = "";
var oldTitle ="";
const video = document.querySelector('video') || document.querySelector('audio');
const socket = io("ws://127.0.0.1:8080");


socket.on('connect', () => {
    console.log('connected');
});     
console.log("content.js loaded and running");



// Example client-side code:
socket.on('my_response', (data) => {
    console.log('Received my_response from server:', data);
  });
  

// Basically watches to see if the website is gonna change
setInterval(() => {
    if (document.title !== oldTitle) {
        oldTitle = document.title;
        console.log("Title changed:", oldTitle);

        // If there's meta data update dat shiz
        if (navigator.mediaSession?.metadata) {
            setMediaMetadata(
                navigator.mediaSession.metadata.title,
                navigator.mediaSession.metadata.artist,
                navigator.mediaSession.metadata.album,
                navigator.mediaSession.metadata.artwork?.[0]?.src,
                navigator.mediaSession.metadata.artwork?.[0]?.sizes
            );
        } else {
          
            setMediaMetadata("", "", "", "", "");
        }
    }
}, 500);

function updateMediaSession() {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaTitle,
        artist: mediaArtist,
        album: mediaAlbum,
        artwork: mediaArtworkSrc ? [{ src: mediaArtworkSrc, sizes: mediaArtworkSizes }] : []
    });
    
    //Setting the video duration and keeping track
    if ('setPositionState' in navigator.mediaSession && video) {
        navigator.mediaSession.setPositionState({
          duration: video.duration || 0,
          playbackRate: video.playbackRate || 1,
          position: video.currentTime || 0
        });
      }


socket.emit('sendTitle', {
    title: mediaTitle,
});
socket.emit('sendArtist', {
    artist: mediaArtist,
});
socket.emit('sendAlbum', {
    album: mediaAlbum,
});
socket.emit('sendArtwork', {
    src: mediaArtworkSrc,
    sizes: mediaArtworkSizes
});

}

     if('mediaSession' in navigator){
socket.on("command", (data) => {
    console.log("Received command from Python:", data);
    switch (data) {
        case "play":
            if ('mediaSession' in navigator) {
                // Play
                navigator.mediaSession.setActionHandler('play', async () => {
                  console.log('> Play requested');
                  if (video) {
                    await video.play();
                    navigator.mediaSession.playbackState = 'playing';
                  }
                });
            }
            break;
        case "pause":
            navigator.mediaSession.setActionHandler('pause', () => {
                console.log('> Pause requested');
                if (video) {
                  video.pause();
                  navigator.mediaSession.playbackState = 'paused';
                }
              });
            break;
        case "next":
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                console.log('> Next Track requested');
                document.querySelector('.next-button')?.click();
            });
            break;
        case "previous":
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                console.log('> Previous Track requested');
                document.querySelector('.previous-button')?.click();
              });
            break;
    }  
});

}
  
function setMediaMetadata(title, artist, album, artworkSrc, artworkSizes) {
    mediaTitle = title;
    mediaArtist = artist;
    mediaAlbum = album;
    mediaArtworkSrc = artworkSrc;
    mediaArtworkSizes = artworkSizes;

    
    updateMediaSession();
}

setMediaMetadata(navigator.mediaSession.metadata.title, navigator.mediaSession.metadata.artist, navigator.mediaSession.metadata.album, navigator.mediaSession.metadata.artwork[0].src, navigator.mediaSession.metadata.artwork[0].sizes);


socket.on('disconnect', () => {
});