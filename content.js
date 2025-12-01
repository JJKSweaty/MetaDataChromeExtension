function sendMetadataToBackground(title, artist, album, artwork) {
    chrome.runtime.sendMessage({
        type: "mediaData",
        data: { title, artist, album, artwork }
    }, (response) => {
        console.log("[SENT TO BACKGROUND SCRIPT]:", response);
    });
}

// Function to send playback progress data
function sendProgressToBackground(position, duration, isPlaying, source) {
    chrome.runtime.sendMessage({
        type: "progressData",
        data: { position, duration, isPlaying, source }
    }, (response) => {
        // Silent - this fires frequently
    });
}

// Detect media source from URL
function getMediaSource() {
    const hostname = window.location.hostname;
    if (hostname.includes("youtube")) return "youtube";
    if (hostname.includes("spotify")) return "spotify";
    if (hostname.includes("soundcloud")) return "soundcloud";
    if (hostname.includes("twitch")) return "twitch";
    return "unknown";
}

// Function to extract media metadata
function checkMediaMetadata() {
    let video = document.querySelector("video, audio");
    if (!video) return;

    let newTitle = document.title || "";
    let newArtist = navigator.mediaSession?.metadata?.artist || "Unknown";
    let newAlbum = navigator.mediaSession?.metadata?.album || "Unknown";
    let newArtwork = navigator.mediaSession?.metadata?.artwork?.[0]?.src || "";

    sendMetadataToBackground(newTitle, newArtist, newAlbum, newArtwork);
}

// Function to send progress updates
function checkMediaProgress() {
    let video = document.querySelector("video, audio");
    if (!video) return;
    
    // Get current position and duration in seconds
    const position = Math.floor(video.currentTime) || 0;
    const duration = Math.floor(video.duration) || 0;
    const isPlaying = !video.paused && !video.ended;
    const source = getMediaSource();
    
    // Only send if we have valid duration
    if (duration > 0) {
        sendProgressToBackground(position, duration, isPlaying, source);
    }
}

// Monitor media metadata every 2 seconds
setInterval(checkMediaMetadata, 2000);

// Monitor progress more frequently (every 1 second)
setInterval(checkMediaProgress, 1000);

// Listen for commands from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "command") {
        console.log("[RECEIVED COMMAND]:", request.command);
        
        let video = document.querySelector("video, audio");
        if (!video) return;

        switch (request.command) {
            case "play":
                console.log("Playing the media...");
                video.play();
                break;
            case "pause":
                video.pause();
                break;
            case "next":
                document.querySelector(".ytp-next-button")?.click();
                break;
            case "previous":
                document.querySelector(".ytp-prev-button")?.click();
                break;
        }

        sendResponse({ status: "Command executed!" });
    }
});