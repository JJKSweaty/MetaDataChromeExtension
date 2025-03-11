function sendMetadataToBackground(title, artist, album, artwork) {
    chrome.runtime.sendMessage({
        type: "mediaData",
        data: { title, artist, album, artwork }
    }, (response) => {
        console.log("[SENT TO BACKGROUND SCRIPT]:", response);
    });
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

// Monitor media changes every 2 seconds
setInterval(checkMediaMetadata, 2000);

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