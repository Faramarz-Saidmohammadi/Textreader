# VoiceBridge

VoiceBridge is an accessible browser-based communication board and text-to-speech application built with semantic HTML, modern CSS, and vanilla JavaScript. It provides quick phrase cards and a configurable speech workspace without requiring accounts, servers, or external APIs.

## Highlights

- Responsive communication board with 12 ready-to-use phrases
- Search and category filtering for faster access
- Browser-native text-to-speech using the Web Speech API
- Voice selection with adjustable rate and pitch
- Custom message composer with keyboard shortcut support
- Stop/cancel speech controls and live status feedback
- Accessible focus states, semantic controls, skip navigation, and reduced-motion support
- Privacy-friendly client-side architecture with no backend dependency

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API

## Project structure

```text
.
├── index.html      # Semantic application shell
├── style.css       # Responsive UI and accessibility styles
├── app.js          # Phrase filtering and speech-synthesis logic
└── img/            # Communication-card imagery
```

## Run locally

No build step or package installation is required.

1. Clone the repository.
2. Open `index.html` in a modern browser.
3. For the most consistent experience, serve the folder through a local development server.

Example with VS Code Live Server or any static HTTP server:

```bash
npx serve .
```

## Usage

1. Select a phrase card to speak it aloud.
2. Use search or category filters to narrow the board.
3. Choose a system voice and adjust rate or pitch.
4. Write a custom message and select **Speak message**.
5. Press **Ctrl+Enter** (or **Cmd+Enter** on macOS) from the message field to speak quickly.

## Browser support

VoiceBridge depends on the Web Speech API. Available voices, languages, and speech quality vary by browser and operating system. Chromium-based browsers generally provide the broadest support.

## Accessibility notes

The interface is designed for keyboard navigation and includes semantic form controls, visible focus treatment, descriptive button labels, live speech status messaging, a skip link, and a reduced-motion fallback. Accessibility should still be validated with real users and assistive technologies before production use in clinical or high-stakes contexts.

## Privacy

VoiceBridge does not include analytics, authentication, a backend, or application-level network requests. Speech processing behavior ultimately depends on the browser/operating-system speech engine selected by the user.

## Roadmap

- User-defined phrase collections
- Phrase favorites and recent history
- Import/export of communication boards
- Localization and multilingual board presets
- Installable PWA mode and offline caching

## Author

Developed and maintained by **Faramarz Said Mohammadi**.

## License

This repository does not currently declare an open-source license. All rights remain with the repository owner unless a license is added later.
