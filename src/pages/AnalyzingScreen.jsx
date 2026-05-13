import Header from '../components/Header'

function AnalyzingScreen({ onBack, previewUrl }) {
  return (
    <section className="screen-root analyzing-screen">
      <Header title="Analyzing" leftIcon="←" onLeftClick={onBack} leftLabel="Go back" />

      {previewUrl ? (
        <div className="preview-thumb">
          <img src={previewUrl} alt="Selected receipt preview" />
        </div>
      ) : null}

      <div className="analysis-ring" aria-hidden="true">
        <div className="analysis-core">
          <div className="receipt-paper">
            <div className="paper-fold"></div>
            <div className="paper-line line-one"></div>
            <div className="paper-line line-two"></div>
            <div className="paper-line line-three"></div>
            <div className="paper-zigzag"></div>
          </div>
        </div>
      </div>

      <div className="screen-copy">
        <h1 className="screen-title">Analyzing Receipt...</h1>
        <p className="screen-subtitle">Extracting information using AI</p>
      </div>

      <p className="status-caption">This may take a few seconds.</p>
    </section>
  )
}

export default AnalyzingScreen
