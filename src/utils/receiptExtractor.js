const GEMINI_MODEL = 'gemini-2.5-flash'

const RECEIPT_PROMPT = `
Extract the key fields from this receipt image.

Return strict JSON only in this exact shape:
{
  "merchantName": "",
  "date": "",
  "totalAmount": "",
  "currency": ""
}

Rules:
- merchantName must contain the store or merchant name only.
- date should be in YYYY-MM-DD format when possible.
- totalAmount should be the final total as a number string without any currency symbol.
- currency should be a 3-letter currency code such as USD, SGD, EUR, or MYR when possible.
- If a field is unclear, return an empty string for that field.
`.trim()

const RECEIPT_SCHEMA = {
  type: 'object',
  properties: {
    merchantName: {
      type: 'string',
      description: 'Merchant or store name shown on the receipt.',
    },
    date: {
      type: 'string',
      description: 'Receipt date in YYYY-MM-DD format when possible.',
    },
    totalAmount: {
      type: 'string',
      description: 'Final total amount on the receipt without currency symbols.',
    },
    currency: {
      type: 'string',
      description: '3-letter currency code when identifiable, otherwise empty string.',
    },
  },
  required: ['merchantName', 'date', 'totalAmount', 'currency'],
}

export function hasGeminiApiKey() {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY)
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      if (typeof result !== 'string') {
        reject(new Error('Unable to read the selected receipt image.'))
        return
      }

      const [, base64Data = ''] = result.split(',')
      resolve(base64Data)
    }

    reader.onerror = () => {
      reject(new Error('Unable to convert the receipt image for Gemini.'))
    }

    reader.readAsDataURL(file)
  })
}

function extractResponseText(responseData) {
  return (
    responseData?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim() || ''
  )
}

function normalizeDate(value) {
  if (!value) {
    return ''
  }

  const isoMatch = String(value).match(/\d{4}-\d{2}-\d{2}/)

  if (isoMatch) {
    return isoMatch[0]
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value).trim()
  }

  return parsedDate.toISOString().slice(0, 10)
}

function validateReceiptShape(parsedData) {
  if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
    throw new Error('Gemini returned an invalid receipt object.')
  }

  const requiredFields = ['merchantName', 'date', 'totalAmount', 'currency']

  requiredFields.forEach((field) => {
    if (!(field in parsedData)) {
      throw new Error(`Gemini response is missing the "${field}" field.`)
    }
  })
}

function normalizeCurrency(value) {
  const rawCurrency = String(value || '').trim()

  if (!rawCurrency) {
    return ''
  }

  const upperCurrency = rawCurrency.toUpperCase()

  if (['MYANMAR KYAT', 'KYAT', 'K', 'KS', 'MMK'].includes(upperCurrency)) {
    return 'MMK'
  }

  if (['RINGGIT', 'RM', 'MYR'].includes(upperCurrency)) {
    return 'MYR'
  }

  if (upperCurrency === '$' || upperCurrency === 'DOLLAR') {
    return 'USD'
  }

  return upperCurrency
}

function normalizeReceiptData(parsedData) {
  validateReceiptShape(parsedData)

  return {
    merchantName: String(parsedData.merchantName || '').trim(),
    date: normalizeDate(parsedData.date || ''),
    totalAmount: String(parsedData.totalAmount || '').replace(/[^\d.,-]/g, '').trim(),
    currency: normalizeCurrency(parsedData.currency),
  }
}

function parseReceiptJson(rawText) {
  try {
    return JSON.parse(rawText)
  } catch (error) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('Gemini returned invalid JSON. Please try a clearer receipt image.')
    }

    try {
      return JSON.parse(jsonMatch[0])
    } catch (nestedError) {
      throw new Error('Gemini returned invalid JSON. Please try a clearer receipt image.')
    }
  }
}

export async function extractReceiptData(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY before scanning.')
  }

  const imageData = await fileToBase64(file)
  const mimeType = file.type || 'image/jpeg'

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: RECEIPT_PROMPT },
              {
                inlineData: {
                  mimeType,
                  data: imageData,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseJsonSchema: RECEIPT_SCHEMA,
        },
      }),
    },
  )

  const responseData = await response.json()

  if (!response.ok) {
    const apiMessage =
      responseData?.error?.message || 'Gemini could not extract receipt data from this image.'

    throw new Error(apiMessage)
  }

  const rawText = extractResponseText(responseData)

  if (!rawText) {
    throw new Error('Gemini returned an empty response. Please try another receipt image.')
  }

  const parsedData = parseReceiptJson(rawText)

  return normalizeReceiptData(parsedData)
}
