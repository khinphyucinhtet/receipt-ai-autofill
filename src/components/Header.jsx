function Header({
  title,
  leftIcon = '',
  rightIcon = '',
  onLeftClick,
  onRightClick,
  leftLabel = 'Back',
  rightLabel = 'Action',
}) {
  return (
    <header className="header-bar">
      <div className="header-side">
        {leftIcon ? (
          <button
            type="button"
            className="header-button"
            onClick={onLeftClick}
            aria-label={leftLabel}
          >
            <span className="header-icon">{leftIcon}</span>
          </button>
        ) : null}
      </div>

      <h2 className="header-title">{title}</h2>

      <div className="header-side">
        {rightIcon ? (
          <button
            type="button"
            className="header-button"
            onClick={onRightClick}
            aria-label={rightLabel}
          >
            <span className="header-icon">{rightIcon}</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}

export default Header
