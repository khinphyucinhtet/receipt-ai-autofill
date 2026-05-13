import { useEffect, useState } from 'react'
import './App.css'
import SplashScreen from './pages/SplashScreen'
import UploadScreen from './pages/UploadScreen'
import AnalyzingScreen from './pages/AnalyzingScreen'
import ExtractingScreen from './pages/ExtractingScreen'
import ReviewScreen from './pages/ReviewScreen'
import SuccessScreen from './pages/SuccessScreen'
import { extractReceiptData, hasGeminiApiKey } from './utils/receiptExtractor'

const SCREENS = {
  splash: 'splash',
  upload: 'upload',
  analyzing: 'analyzing',
  extracting: 'extracting',
  review: 'review',
  success: 'success',
}

const EMPTY_RECEIPT_DATA = {
  merchantName: '',
  date: '',
  totalAmount: '',
  currency: '',
}

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration))

function App() {
  const [screen, setScreen] = useState(SCREENS.splash)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [receiptData, setReceiptData] = useState(EMPTY_RECEIPT_DATA)
  const [savedData, setSavedData] = useState(null)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setScreen(SCREENS.upload)
    }, 2000)

    return () => window.clearTimeout(splashTimer)
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const setSelectedReceiptFile = (file) => {
    if (!file) {
      return
    }

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    const nextPreviewUrl = URL.createObjectURL(file)

    setSelectedFile(file)
    setPreviewUrl(nextPreviewUrl)
    setUploadError('')
  }

  const handleFileSelect = (eventOrFile) => {
    if (eventOrFile instanceof File) {
      setSelectedReceiptFile(eventOrFile)
      return
    }

    const file = eventOrFile?.target?.files?.[0]
    setSelectedReceiptFile(file)
  }

  const handleStartScan = () => {
    if (!selectedFile) {
      setUploadError('Select or capture a receipt image before scanning.')
      return
    }

    if (!hasGeminiApiKey()) {
      setUploadError('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your local .env or Vercel settings.')
      return
    }

    const runScan = async () => {
      try {
        setUploadError('')
        setSavedData(null)
        setScreen(SCREENS.analyzing)

        const extractedReceiptPromise = extractReceiptData(selectedFile)

        await wait(2000)

        const extractedReceipt = await extractedReceiptPromise

        setReceiptData(extractedReceipt)
        setScreen(SCREENS.extracting)

        await wait(2000)
        setScreen(SCREENS.review)
      } catch (error) {
        setUploadError(
          error.message || 'Gemini extraction failed. Please try another receipt image.',
        )
        setScreen(SCREENS.upload)
      }
    }

    runScan()
  }

  const handleFieldChange = (field, value) => {
    setReceiptData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  const handleSave = () => {
    localStorage.setItem('receipt-ai-detector:last-receipt', JSON.stringify(receiptData))
    setSavedData(receiptData)
    setScreen(SCREENS.success)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleGoHome = () => {
    setScreen(SCREENS.upload)
  }

  const handleResetToUpload = () => {
    setScreen(SCREENS.upload)
  }

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-glow-one"></div>
      <div className="ambient-glow ambient-glow-two"></div>
      <div className={`device-frame screen-${screen}`}>
        {screen === SCREENS.splash && <SplashScreen />}

        {screen === SCREENS.upload && (
          <UploadScreen
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onStartScan={handleStartScan}
            errorMessage={uploadError}
          />
        )}

        {screen === SCREENS.analyzing && (
          <AnalyzingScreen onBack={handleResetToUpload} previewUrl={previewUrl} />
        )}

        {screen === SCREENS.extracting && (
          <ExtractingScreen
            extractedData={receiptData}
            onBack={handleResetToUpload}
          />
        )}

        {screen === SCREENS.review && (
          <ReviewScreen
            receiptData={receiptData}
            onChange={handleFieldChange}
            onBack={handleResetToUpload}
            onSave={handleSave}
            onPrint={handlePrint}
          />
        )}

        {screen === SCREENS.success && (
          <SuccessScreen
            receiptData={savedData || receiptData}
            onPrint={handlePrint}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </div>
  )
}

export default App
