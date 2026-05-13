# AI Receipt Detector

AI Receipt Detector is a React + Vite web app that captures or uploads a receipt image, sends it to Gemini for extraction, and lets the user review the detected fields before saving.

## Features

- 6-screen assessment flow from splash to saved confirmation
- Live camera preview using `navigator.mediaDevices.getUserMedia()`
- Camera capture, switch camera, and close camera controls
- Gallery and file upload fallback for browsers or devices without live camera support
- Gemini receipt extraction for `merchantName`, `date`, `totalAmount`, and `currency`
- Editable review form and localStorage save
- Print / PDF-ready confirmation flow

## Camera

- Tap `Camera` to request permission and open a live preview inside the scanner frame.
- Tap `Capture` to take a snapshot from the live video feed.
- Tap `Switch Camera` to toggle between back and front cameras when supported.
- Tap `Close Camera` to stop the stream without capturing.
- Gallery and Upload still work as normal file pickers.

## Camera Permission Note

- Live camera preview works on `localhost` during development.
- On phones and deployed sites, `getUserMedia()` usually requires `HTTPS`.
- If camera permission is blocked or unsupported, the app shows a friendly message and the user can still upload a receipt image manually.

## Gemini API Key

Create a `.env` file in the project root and add:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

The app reads the key only from `import.meta.env.VITE_GEMINI_API_KEY`.

## Run Locally

```bash
npm install
npm run dev
```

## Test On Phone

Run the dev server with host exposure:

```bash
npm run dev -- --host
```

Then open the local network URL shown by Vite on your phone. For live camera preview on a phone, use `localhost` testing alternatives carefully or deploy over HTTPS.

## Deploy On Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variable:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

4. Deploy the project.

Vercel serves the app over HTTPS, which is important for live mobile camera preview.
