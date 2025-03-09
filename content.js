let mediaTitle = "";
let mediaArtist = "";
let mediaAlbum = "";
let mediaArtworkSrc = "";
let mediaArtworkSizes = "";
let oldTitle = "";

const video = document.querySelector("video") || document.querySelector("audio");
const socket = io("ws://127.0.0.1:8080");

socket.on("connect", () => {
    console.log("[CONNECTED] Successfully connected to server.");
});

console.log("content.js loaded and running");

// Ensure media metadata is updated when the page title changes
setInterval(() => {
    if (document.title !== oldTitle) {
        oldTitle = document.title;
        console.log("[TITLE CHANGED] ->", oldTitle);

        if (navigator.mediaSession && navigator.mediaSession.metadata) {
            setMediaMetadata(
                navigator.mediaSession.metadata.title || "",
                navigator.mediaSession.metadata.artist || "",
                navigator.mediaSession.metadata.album || "",
                navigator.mediaSession.metadata.artwork?.[0]?.src || "",
                navigator.mediaSession.metadata.artwork?.[0]?.sizes || ""
            );
        } else {
            setMediaMetadata("", "", "", "", "");
        }
    }
}, 500);

function updateMediaSession() {
    if (!navigator.mediaSession) return;

    navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaTitle,
        artist: mediaArtist,
        album: mediaAlbum,
        artwork: mediaArtworkSrc ? [{ src: mediaArtworkSrc, sizes: mediaArtworkSizes }] : [],
    });

    // Update position state if available
    if ("setPositionState" in navigator.mediaSession && video) {
        navigator.mediaSession.setPositionState({
            duration: video.duration || 0,
            playbackRate: video.playbackRate || 1,
            position: video.currentTime || 0,
        });
    }

    // Send metadata to server
    socket.emit("sendTitle", mediaTitle);
    socket.emit("sendArtist", mediaArtist);
    socket.emit("sendAlbum", mediaAlbum);
    socket.emit("sendArtwork", { src: mediaArtworkSrc, sizes: mediaArtworkSizes });
}

// Ensure media session actions are registered only **once**
if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", () => {
        console.log("[ACTION] Play requested");
        if (video) video.play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
        console.log("[ACTION] Pause requested");
        if (video) {
            video.pause();
            navigator.mediaSession.playbackState = "paused";
        }
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
        console.log("[ACTION] Next track requested");
        document.querySelector(".next-button")?.click();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
        console.log("[ACTION] Previous track requested");
        document.querySelector(".previous-button")?.click();
    });
}

// Handle incoming commands from the Python server
socket.on("command", (data) => {
    console.log(`[RECEIVED COMMAND] -> ${data}`);
    switch (data) {
        case "play":
            console.log("[PLAY] Attempting to play...");
            video?.play();
            break;
        case "pause":
            console.log("[PAUSE] Attempting to pause...");
            if (video) {
                video.pause();
                navigator.mediaSession.playbackState = "paused";
            }
            break;
        case "next":
            console.log("[NEXT] Skipping track...");
            document.querySelector(".next-button")?.click();
            break;
        case "previous":
            console.log("[PREVIOUS] Going back...");
            document.querySelector(".previous-button")?.click();
            break;
        default:
            console.log("[ERROR] Unknown command received:", data);
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
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'play') {
        video?.play();
    }
  });

// Initialize metadata if available
if (navigator.mediaSession && navigator.mediaSession.metadata) {
    setMediaMetadata(
        navigator.mediaSession.metadata.title || "",
        navigator.mediaSession.metadata.artist || "",
        navigator.mediaSession.metadata.album || "",
        navigator.mediaSession.metadata.artwork?.[0]?.src || "",
        navigator.mediaSession.metadata.artwork?.[0]?.sizes || ""
    );
}

socket.on("disconnect", () => {
    console.log("[DISCONNECTED] Lost connection to server.");
});

