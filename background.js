importScripts("socket.io.min.js");
const socket = io("ws://127.0.0.1:8080", { transports: ["websocket"] });

socket.on("connect", () => {
    console.log("[✅ WEBSOCKET CONNECTED] Background script connected to WebSocket server.");
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "mediaData") {
        console.log("[RECEIVED FROM CONTENT SCRIPT]:", request.data);

        // Send the metadata to the WebSocket server
        socket.emit("sendTitle", request.data.title);
        socket.emit("sendArtist", request.data.artist);
        socket.emit("sendAlbum", request.data.album);
        socket.emit("sendArtwork", { src: request.data.artwork });

        sendResponse({ status: "Metadata received by background script!" });
    }
});

// Listen for commands from the WebSocket server and forward them to the content script
socket.on("command", (cmd) => {
    console.log("[RECEIVED COMMAND FROM SERVER]:", cmd);
    
    // Send the command to all active tabs with the content script
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { type: "command", command: cmd });
        }
    });
});