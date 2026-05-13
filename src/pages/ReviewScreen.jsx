import Header from '../components/Header'

function ReviewScreen({ receiptData, onChange, onBack, onSave, onPrint }) {
  return (
    <section className="screen-root screen-light review-screen">
      <Header title="Review & Edit" leftIcon="←" onLeftClick={onBack} leftLabel="Go back" />

      <div className="screen-copy">
        <p className="review-note">
          Please review the extracted information and make changes if needed.
        </p>
      </div>

      <div className="print-area">
        <div className="form-card">
          <form className="review-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-field">
              <label className="form-label" htmlFor="merchantName">
                Merchant Name
              </label>
              <input
                id="merchantName"
                className="form-input"
                type="text"
                value={receiptData.merchantName}
                onChange={(event) => onChange('merchantName', event.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                className="form-input"
                type="date"
                value={receiptData.date}
                onChange={(event) => onChange('date', event.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="totalAmount">
                Total Amount
              </label>
              <input
                id="totalAmount"
                className="form-input"
                type="text"
                value={receiptData.totalAmount}
                onChange={(event) => onChange('totalAmount', event.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="currency">
                Currency
              </label>
              <select
                id="currency"
                className="form-select"
                value={receiptData.currency}
                onChange={(event) => onChange('currency', event.target.value)}
              >
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
                <option value="EUR">EUR</option>
                <option value="MYR">MYR</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="primary-button" onClick={onSave}>
          Save / Submit
        </button>
        <button type="button" className="secondary-button" onClick={onPrint}>
          Save as PDF
        </button>
      </div>
    </section>
  )
}

export default ReviewScreen
