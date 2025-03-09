importScripts('./socket.io.min.js');
const socket = io('http://localhost:8080', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('Connected to server!');
});

socket.on('command', (command) => {
  console.log('Server sent:', command);
  // Relay to active tab
  chrome.tabs.query({active: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: command});
  });
});
