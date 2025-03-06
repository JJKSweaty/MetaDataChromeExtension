let mediaTitle = "";
let mediaArtist = "";
let mediaAlbum = "";
let mediaArtworkSrc = "";
let mediaArtworkSizes = "";

const socket = io("ws://127.0.0.1:8080");


socket.on('connect', () => {
    console.log('connected');
});     

socket.on('requestTitle', () => {
    socket.emit('sendTitle', mediaTitle);
});

socket.on('requestArtist', () => {
    socket.emit('sendArtist', mediaArtist);
});

socket.on('requestAlbum', () => {
    socket.emit('sendAlbum', mediaAlbum);
});

socket.on('requestArtwork', () => {
    socket.emit('sendArtwork', {
        src: mediaArtworkSrc,
        sizes: mediaArtworkSizes
    });
});

// Basically watches to see if the website is gonna change
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (document.title !== oldTitle) {
        oldTitle = document.title;
        setMediaMetadata(navigator.mediaSession.metadata.title, navigator.mediaSession.metadata.artist, navigator.mediaSession.metadata.album, navigator.mediaSession.metadata.artwork[0].src, navigator.mediaSession.metadata.artwork[0].sizes);
        console.log("New video detected by title change:", document.title);
      }
    });
  });
  
  observer.observe(document.querySelector("title"), {
    childList: true,
  });
function updateMediaSession() {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaTitle,
        artist: mediaArtist,
        album: mediaAlbum,
        artwork: mediaArtworkSrc ? [{ src: mediaArtworkSrc, sizes: mediaArtworkSizes }] : []
    });


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


socket.on("command", (data) => {
    console.log("Received command from Python:", data);
    switch (data) {
        case "play":
            const playBtn = document.querySelector("a.ytp-play-button.ytp-button");
            playBtn?.click();
            break;
        case "pause":
            const pauseBtn = document.querySelector("a.ytp-play-button.ytp-button");
            pauseBtn?.click();
            break;
        case "next":
            const nextBtn = document.querySelector("a.ytp-next-button.ytp-button");
            nextBtn?.click();
            break;
        case "previous":
            const prevBtn = document.querySelector("a.ytp-prev-button.ytp-button");
            prevBtn?.click();
            break;
    }  

});
  
function setMediaMetadata(title, artist, album, artworkSrc, artworkSizes) {
    mediaTitle = title;
    mediaArtist = artist;
    mediaAlbum = album;
    mediaArtworkSrc = artworkSrc;
    mediaArtworkSizes = artworkSizes;

    
    updateMediaSession();
}



