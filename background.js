importScripts("socket.io.min.js");
const socket = io("ws://127.0.0.1:8080", { transports: ["websocket"] });
const SERVER_URL = "http://localhost:8080";
socket.on("connect", () => {
    console.log("[ WEBSOCKET CONNECTED] Background script connected to WebSocket server.");
});
// Poll the Flask server every 2 seconds
setInterval(() => {
  fetch(`${SERVER_URL}/get_command`)
    .then(res => res.json())
    .then(data => {
      if (data.command) {
        console.log("[COMMAND FROM SERVER]:", data.command);
        // Send the command to all active tabs
        chrome.tabs.query({}, (tabs) => {
          for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, {
              type: "command",
              command: data.command
            });
          }
        });
      }
    })
    .catch(err => console.error("Polling error:", err));
}, 1000);

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
