## Front

### Unsorted

- [x] Add `play`,`slow` buttons to trigger playback at different rates

### Logic

- count unique match attempts
- get all words into word cards
- display X cards
- choose items per stage and shuffle among them a single word
  - the sound is one of those words in the stage
-

### Sound

- [ ] Use pronunciation of the word as the sound
- [ ] Preload audio and waveform data per category for faster experience
- [ ] Store waveform as compressed JSON or downsampled vector for performance

## Back

- [ ] Setup backend to serve the sound files
- [ ] Generate `.wav` / `.mp3` sound files from words
- [ ] Generate waveform data (array of amplitudes or SVG path)
  - [ ] Option 1: Fake waveform animation synced to duration
  - [ ] Option 2: Real-time visualization using `AnalyserNode` (Web Audio API)
  - [ ] Option 3: Precomputed waveform data rendered via `<canvas>` or `<svg>`
    **Resources:**
- [Waveform Audio Player using Canvas](https://bdshrk.github.io/portfolio/waveform/?utm_source=chatgpt.com)
- [Visualising Waveforms with Web Audio](https://sonoport.github.io/visualising-waveforms-with-web-audio.html?utm_source=chatgpt.com)
- [BBC Peaks.js (Interactive waveform)](https://waveform.prototyping.bbc.co.uk/?utm_source=chatgpt.com)
- [ ] Pass waveform data to frontend along with audio URL
