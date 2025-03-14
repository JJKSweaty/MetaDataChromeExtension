# Media Tracker Chrome Extension

This Chrome extension tracks media playback across websites and allows remote control via WebSocket commands.

## Features

- Extracts media metadata (title, artist, album, artwork) from web pages
- Sends metadata to a Python backend server via WebSocket
- Receives commands from the server to control media playback (play, pause, next, previous)

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the `ChromeExtension` folder

## Usage

1. Make sure the Python backend server is running on `127.0.0.1:8080`
2. The extension will automatically connect to the server when Chrome starts
3. When you visit a website with media content, the extension will extract metadata and send it to the server
4. You can send commands from the Python backend to control media playback

## Troubleshooting

- If the extension doesn't connect to the server, check that the server is running and accessible
- If commands don't work on a specific website, the site might use custom media controls that aren't supported
- Check the browser console for error messages (right-click > Inspect > Console)

## Development

- `background.js`: Handles WebSocket communication with the server
- `content.js`: Extracts metadata and controls media playback
- `manifest.json`: Extension configuration 