import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dash-wrap">

      <div className="dash-header">
        <div>
          <div className="dash-greeting">Good morning,</div>
          <div className="dash-name">Amanda 👋</div>
        </div>
        <div className="dash-date">Thursday<br />9 April 2026</div>
      </div>

      <div className="hero-card">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="status-dot"></span>
            On Track
          </div>
          <div className="hero-label">Brain Health Index</div>
          <div className="hero-score">70 <span className="hero-score-max">/ 100</span></div>
          <div className="hero-score-sub">Top 38% of students your age</div>
        </div>
        <div className="hero-right">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8"/>
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(93,202,165,0.8)" strokeWidth="8"
              strokeDasharray="226" strokeDashoffset="68" strokeLinecap="round"
              transform="rotate(-90 45 45)"/>
          </svg>
        </div>
      </div>

      <div className="metric-row">
        <div className="metric-card">
          <div className="metric-icon sleep">🌙</div>
          <div className="metric-label">Sleep last night</div>
          <div className="metric-value">7<span className="metric-unit">h 15m</span></div>
          <div className="metric-bar-track">
            <div className="metric-bar-fill good" style={{ width: '72%' }}></div>
          </div>
          <div className="metric-status good">Good duration</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon screen">📱</div>
          <div className="metric-label">Pre-sleep screen</div>
          <div className="metric-value">1<span className="metric-unit">h 20m</span></div>
          <div className="metric-bar-track">
            <div className="metric-bar-fill bad" style={{ width: '80%' }}></div>
          </div>
          <div className="metric-status bad">Too high</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon study">📚</div>
          <div className="metric-label">Study today</div>
          <div className="metric-value">4<span className="metric-unit">h</span></div>
          <div className="metric-bar-track">
            <div className="metric-bar-fill good" style={{ width: '67%' }}></div>
          </div>
          <div className="metric-status good">On target</div>
        </div>
      </div>

      <div className="section-heading">Active alerts</div>

      <div className="warning-card">
        <div className="warning-icon">⚠️</div>
        <div className="warning-body">
          <div className="warning-title">Screen use before bed is high</div>
          <div className="warning-text">You've used screens within 1 hour of bedtime 5 nights in a row. This can disrupt your memory consolidation.</div>
        </div>
      </div>

      <div className="warning-card red">
        <div className="warning-icon">🔴</div>
        <div className="warning-body">
          <div className="warning-title">Sleep schedule irregular this week</div>
          <div className="warning-text">Your bedtime has varied by more than 90 minutes over the past 3 days.</div>
        </div>
      </div>

      <div className="section-heading">Personalised insights</div>

      <div className="insight-card">
        <div className="insight-dot"></div>
        <div className="insight-text"><strong>Your sleep duration is solid</strong> — averaging 7h 15m puts you above the national young adult average. Focus on consistency rather than adding more hours.</div>
      </div>
      <div className="insight-card">
        <div className="insight-dot amber"></div>
        <div className="insight-text"><strong>Late-night screen use is your biggest risk factor.</strong> Blue light before bed suppresses melatonin, directly affecting how well your brain consolidates what you studied.</div>
      </div>
      <div className="insight-card">
        <div className="insight-dot blue"></div>
        <div className="insight-text"><strong>Your 4-hour study sessions are productive</strong> — consider adding a 10-minute break every 45 minutes to restore attention and improve retention.</div>
      </div>

    </div>
  )
}

export default Dashboard