# AI Receipt Detector

Live Demo: https://vercel.com/api/toolbar/link/receipt-ai-autofill-azure.vercel.app?via=project-overview-visit-button&p=1&i=visit-with-toolbar

AI Receipt Detector is a React + Vite web app built for a receipt-to-form auto-fill assessment. It lets users capture a receipt with a live camera preview or upload an image, sends the receipt to Gemini for field extraction, and then allows the user to review, edit, save, and print the extracted data.

## How It Works

The app follows a simple 6-screen flow:

1. **Splash Screen**
   - Shows the AI Receipt Detector intro screen for 2 seconds.

2. **Upload / Capture Receipt**
   - Users can:
     - open a live camera preview
     - switch between front and back camera when supported
     - capture a receipt from the live video feed
     - upload a receipt from Gallery or Upload
   - The `Scan Receipt` button becomes active only after an image is selected or captured.

3. **Analyzing Receipt**
   - Shows the scanning/loading state while the app starts the Gemini extraction process.

4. **Extracting Details**
   - Shows the detected receipt fields before moving to review.

5. **Review & Edit**
   - Users can edit:
     - Merchant Name
     - Date
     - Total Amount
     - Currency

6. **Success / Saved**
   - Shows the saved summary.
   - Users can print the result or return home.

## Project Flow

- User selects or captures a receipt image.
- The image is converted to base64 in the browser.
- The app sends the image to Gemini using `VITE_GEMINI_API_KEY`.
- Gemini returns structured JSON for:
  - `merchantName`
  - `date`
  - `totalAmount`
  - `currency`
- The extracted fields are shown in an editable review form.
- The final edited data is saved in `localStorage`.
- The user can print or save the final summary as PDF using the browser print flow.

## Features

- 6-screen assessment flow from splash to saved confirmation
- Live camera preview using `navigator.mediaDevices.getUserMedia()`
- Camera capture using the live video frame
- Switch camera support for front/back camera where available
- Close camera support to stop the stream cleanly
- Gallery and file upload fallback for unsupported or blocked camera access
- Gemini receipt extraction for:
  - `merchantName`
  - `date`
  - `totalAmount`
  - `currency`
- Editable review form before final save
- `localStorage` save support
- Print / PDF-ready confirmation flow
- Responsive design for laptop and mobile screens

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Gemini API
- localStorage

## Camera

- Tap the bottom middle `Camera` button to request permission and open a live preview.
- When the live preview is open, the same bottom middle button becomes `Capture`.
- Tap `Capture` to take a snapshot from the live camera feed.
- Tap `🔄 Switch` to toggle between back and front camera when supported.
- Tap `Close Camera` to stop the camera stream without capturing.
- If camera access is blocked or unsupported, users can still continue with Gallery or Upload.

## Camera Permission Note

- Live camera preview works on `localhost` during development.
- On phones and deployed sites, `getUserMedia()` usually requires `HTTPS`.
- If the browser blocks camera preview, the app shows a friendly message and the upload flow still works.

## Gemini API Key

Create a `.env` file in the project root and add:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

The app reads the API key only from:

```bash
import.meta.env.VITE_GEMINI_API_KEY
```

## Environment / Security Note

- For this assessment/demo version, Gemini is called directly from the frontend.
- For a production app, the Gemini API request should be moved to a backend or serverless function so the API key is not exposed in the client bundle.

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

Then open the local network URL shown by Vite on your phone. For reliable live camera preview on mobile, HTTPS deployment is recommended.

## Build Check

The project has been verified with:

```bash
npm run build
```

## Deploy On Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variable:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

4. Deploy the project.
5. Copy the generated Vercel URL and replace the top line:

```bash
Live Demo: Add your Vercel link here later
```

Vercel serves the app over HTTPS, which is important for live mobile camera preview.
