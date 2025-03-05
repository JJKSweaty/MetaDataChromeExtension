navigator.mediaSession.metadata = new MediaMetadata

const mediaSession = navigator.mediaSession;

mediaTitle = navigator.mediaSession.metadata.title;
mediaArtist = navigator.mediaSession.metadata.artist;
mediaAlbum = navigator.mediaSession.metadata.album;
mediaArtwork = navigator.mediaSession.metadata.artwork;
mediaArtworkSizes = navigator.mediaSession.metadata.artwork.sizes;
mediaArtworkSrc = navigator.mediaSession.metadata.artwork.src;


const socket = io('ws://127.0.0.1:8080');

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
  

