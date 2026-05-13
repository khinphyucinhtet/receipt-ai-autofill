function SplashScreen() {
  return (
    <section className="screen-root splash-screen">
      <div className="splash-circuit"></div>

      <div className="scan-icon" aria-hidden="true">
        <div className="scan-corner top-left"></div>
        <div className="scan-corner top-right"></div>
        <div className="scan-corner bottom-left"></div>
        <div className="scan-corner bottom-right"></div>

        <div className="receipt-paper">
          <div className="paper-fold"></div>
          <div className="paper-line line-one"></div>
          <div className="paper-line line-two"></div>
          <div className="paper-line line-three"></div>
          <div className="paper-zigzag"></div>
        </div>
      </div>

      <div className="screen-copy">
        <h1 className="screen-title">
          AI Receipt <span className="brand-highlight">Detector</span>
        </h1>
        <p className="tagline">Smart. Fast. Accurate.</p>
      </div>

      <div className="loading-bar" aria-hidden="true">
        <div className="loading-fill"></div>
      </div>

      <p className="loading-text">Loading...</p>
    </section>
  )
}

export default SplashScreen
