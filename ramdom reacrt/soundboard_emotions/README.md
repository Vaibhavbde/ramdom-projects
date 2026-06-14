# Soundboard of Emotions

A small React app that maps emoji emotions to short generated sounds using the Web Audio API. No external audio files or API keys required.

## Features
- Click an emoji button to play a short tone matching the emotion
- Adjustable volume and duration
- Visual feedback when a sound plays
- Persistent settings via localStorage

## Run locally
1. npm install
2. npm start

## Notes
Uses Oscillators and Gain nodes to synthesize sounds in-browser.
