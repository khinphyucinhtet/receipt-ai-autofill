function SuccessScreen({ receiptData, onPrint, onGoHome }) {
  const summaryRows = [
    { label: 'Merchant', value: receiptData.merchantName },
    { label: 'Date', value: receiptData.date },
    { label: 'Total Amount', value: receiptData.totalAmount },
    { label: 'Currency', value: receiptData.currency },
  ]

  return (
    <section className="screen-root screen-light success-screen">
      <div className="success-copy">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <h1 className="screen-title">Successfully Saved!</h1>
        <p>Your receipt information has been saved locally.</p>
      </div>

      <div className="print-area">
        <div className="success-card">
          <h2 className="summary-title">Summary</h2>

          {summaryRows.map((row) => (
            <div className="receipt-summary-row" key={row.label}>
              <span className="summary-label">{row.label}</span>
              <span className="summary-value">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="primary-button" onClick={onPrint}>
          View PDF / Print
        </button>
        <button type="button" className="secondary-button" onClick={onGoHome}>
          Go Home
        </button>
      </div>
    </section>
  )
}

export default SuccessScreen
