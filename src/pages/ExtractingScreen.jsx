import Header from '../components/Header'

function ExtractingScreen({ extractedData, onBack }) {
  const rows = [
    { label: 'Merchant Name', value: extractedData.merchantName },
    { label: 'Date', value: extractedData.date },
    { label: 'Total Amount', value: extractedData.totalAmount },
    { label: 'Currency', value: extractedData.currency },
  ]

  return (
    <section className="screen-root extracting-screen">
      <Header
        title="Extracting Details"
        leftIcon="←"
        onLeftClick={onBack}
        leftLabel="Go back"
      />

      <div className="extract-card">
        {rows.map((row) => (
          <div className="extract-row" key={row.label}>
            <div>
              <div className="extract-label">{row.label}</div>
              <div className="extract-value">{row.value}</div>
            </div>
            <div className="check-badge" aria-hidden="true">
              ✓
            </div>
          </div>
        ))}
      </div>

      <p className="status-note">Almost done...</p>

      <div className="progress-wrap" aria-label="Extraction progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <span className="progress-text">90%</span>
      </div>
    </section>
  )
}

export default ExtractingScreen
