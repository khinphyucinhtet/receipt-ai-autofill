# AI Receipt Detector

## Live Demo

https://receipt-ai-autofill-azure.vercel.app/

AI Receipt Detector is a React + Vite web application developed for a receipt-to-form auto-fill assessment. The app allows users to capture or upload receipt images, extract receipt information using Gemini AI, review and edit the extracted details, and save or print the final result.

---

## AI Model

- Gemini 2.5 Flash

---

## Features

- AI-powered receipt field extraction
- Live camera preview using `getUserMedia()`
- Camera capture from live video feed
- Front and back camera switching support
- Gallery and file upload support
- Editable review form before saving
- Local storage save support
- Print / PDF-ready confirmation flow
- Responsive design for laptop and mobile devices
- 6-screen guided user flow

---

## Supported Extracted Fields

The app extracts the following receipt details:

- Merchant Name
- Date
- Total Amount
- Currency

Supported currencies include:

- USD
- MYR
- MMK
- SGD
- THB
- IDR
- PHP
- VND
- JPY
- KRW
- CNY
- INR
- EUR
- GBP
- AUD
- CAD

---

## Application Flow

### 1. Splash Screen
Displays the AI Receipt Detector intro screen.

### 2. Upload / Capture Receipt
Users can:
- Open a live camera preview
- Switch between front and back camera
- Capture a receipt from the live camera feed
- Upload receipt images from Gallery or Upload

The `Scan Receipt` button becomes active only after an image is selected or captured.

### 3. Analyzing Receipt
Shows the AI scanning/loading state.

### 4. Extracting Details
Displays the extracted receipt information before review.

### 5. Review & Edit
Users can review and edit:
- Merchant Name
- Date
- Total Amount
- Currency

### 6. Success / Saved
Displays the saved receipt summary with print support.

---

## Project Workflow

1. The user uploads or captures a receipt image.
2. The image is converted into base64 format in the browser.
3. The receipt image is sent to Gemini for structured field extraction.
4. Gemini returns structured JSON data.
5. Extracted values are shown inside an editable review form.
6. Final edited data is saved in `localStorage`.
7. Users can print or save the final result as PDF using the browser print flow.

---

## Camera Features

- Tap the bottom middle `Camera` button to open a live camera preview.
- When the preview is active, the same button becomes `Capture`.
- Tap `Capture` to take a snapshot from the live video feed.
- Tap `🔄` to switch between front and back cameras where supported.
- Tap `✕` to close the live camera preview.
- If camera access is blocked or unsupported, users can continue using Gallery or Upload.

---

## Camera Permission Note

- Live camera preview works on `localhost` during development.
- On mobile devices and deployed websites, camera access usually requires `HTTPS`.
- If camera permission is denied, the upload flow remains available.

---

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Gemini API
- localStorage

---

## Environment / Security Note

This assessment version calls Gemini directly from the frontend using:

```env
VITE_GEMINI_API_KEY
