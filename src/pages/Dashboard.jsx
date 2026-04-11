import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import './Dashboard.css'
import { ARTICLES } from '../data/articles'
import { getRecommendedArticles } from '../utils/recommendations'
import SleepDurationChart from '../components/SleepDurationChart'
import PhysicalActivityChart from '../components/PhysicalActivityChart'

const DEFAULT_SNAPSHOT = {
  overallScore: 70,
  overallInterpretation: 'moderate, room to improve',
  responses: { Q1: 3 },
  domainScores: [
    { key: 'sleep_rhythm', label: 'Sleep Rhythm', score: 67 },
    { key: 'move_mode', label: 'Move Mode', score: 75 },
    { key: 'cognitive_strain', label: 'Cognitive Strain', score: 58 },
    { key: 'social_energy', label: 'Social Energy', score: 79 },
  ],
}

const DOMAIN_ICONS = {
  sleep_rhythm: '🌙',
  move_mode: '🏃',
  cognitive_strain: '🧠',
  social_energy: '🤝',
}

const SLEEP_AVERAGE_18_24 = { overall: 7.6, weeknight: 7.51, weekend: 7.59 }

const SLEEP_BANDS = {
  1: { code: 1, label: 'less than 6 hours', midpoint: 5.5, share: 9.5 },
  2: { code: 2, label: '6 to less than 7 hours', midpoint: 6.5, share: 18.0 },
  3: { code: 3, label: '7 to less than 8 hours', midpoint: 7.5, share: 31.0 },
  4: { code: 4, label: '8 to less than 9 hours', midpoint: 8.5, share: 35.8 },
  5: { code: 5, label: '9 hours or more', midpoint: 9.6, share: 5.6 },
}

const ACTIVITY_BANDS = {
  1: { key: 'lt30', label: 'Less than 30 minutes a day' },
  2: { key: '30to60', label: 'About 30 minutes to less than 1 hour a day' },
  3: { key: '1to1_5', label: 'About 1 to less than 1.5 hours a day' },
  4: { key: '1_5to2', label: 'About 1.5 to less than 2 hours a day' },
  5: { key: '2to2_5', label: 'About 2 to less than 2.5 hours a day' },
}

function statusTone(score) {
  if (score >= 75) return 'good'
  if (score >= 50) return 'warn'
  return 'bad'
}

function statusCopy(score) {
  if (score >= 75) return 'Locked in'
  if (score >= 50) return 'In progress'
  return 'Needs attention'
}

function CircleProgress({ score, tone, size = 60 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * score) / 100
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0F4F8" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={tone === 'good' ? '#4A9EDB' : tone === 'warn' ? '#EF9F27' : '#D85A30'}
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
    </svg>
  )
}

function Dashboard() {
  const location = useLocation()
  const [dismissedWarnings, setDismissedWarnings] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const storedSnapshot = localStorage.getItem('brainboostSnapshot')
  const snapshot = location.state ?? (storedSnapshot ? JSON.parse(storedSnapshot) : DEFAULT_SNAPSHOT)

  if (!snapshot) return <Navigate to="/onboarding" replace />

  const dismissWarning = (key) => setDismissedWarnings(prev => [...prev, key])

  const sortedDomains = [...snapshot.domainScores].sort((a, b) => b.score - a.score)
  const strongest = sortedDomains[0]
  const priority = sortedDomains[sortedDomains.length - 1]
  const secondaryPriority = sortedDomains[sortedDomains.length - 2]
  const recommendedArticles = getRecommendedArticles(snapshot, ARTICLES, 3)
  const selectedSleepBand = SLEEP_BANDS[snapshot.responses?.Q1]
  const selectedActivityBand = ACTIVITY_BANDS[snapshot.responses?.Q4]

  const today = new Intl.DateTimeFormat('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())

  const overallTone = statusTone(snapshot.overallScore)
  const circ = 2 * Math.PI * 54
  const offset = circ - (circ * snapshot.overallScore) / 100

  return (
    <div className="dash-wrap">

      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-greeting">Your latest check-in</div>
          <div className="dash-name">Your Brain Vibe</div>
        </div>
        <div className="dash-date">{today}</div>
      </div>

      {/* Hero */}
      <div className="hero-card">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="status-dot"></span>
            {snapshot.overallInterpretation}
          </div>
          <div className="hero-label">Brain Health Snapshot</div>
          <div className="hero-score">
            {snapshot.overallScore} <span className="hero-score-max">/ 100</span>
          </div>
          <div className="hero-score-sub">Sleep · Movement · Stress · Social</div>
        </div>
        <div className="hero-ring-wrap">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
            <circle cx="60" cy="60" r="54" fill="none"
              stroke="rgba(93,202,165,0.9)" strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 60 60)"/>
          </svg>
          <div className="hero-ring-label">
            <div className="hero-ring-num">{snapshot.overallScore}</div>
            <div className="hero-ring-sub">/ 100</div>
          </div>
        </div>
      </div>

      {/* Domain Rings */}
<div className="rings-card">
  {snapshot.domainScores.map((domain, index) => {
    const colors = ['#4A9EDB', '#EF9F27', '#D85A30', '#9B59B6']
    const tone = statusTone(domain.score)
    const r = 45
    const circ = 2 * Math.PI * r
    const offset = circ - (circ * domain.score) / 100
    return (
      <div key={domain.key} className={`ring-item ring-item-${index}`}>
        <div className="ring-svg-wrap">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={r} fill="none"
              stroke={`${colors[index]}22`} strokeWidth="10"/>
            <circle cx="55" cy="55" r={r} fill="none"
              stroke={colors[index]} strokeWidth="10"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
              className="ring-progress"
              style={{
                '--target-offset': offset,
                '--circ': circ,
              }}
            />
          </svg>
          <div className="ring-center-label">
            <div className="ring-score-num" style={{ color: colors[index] }}>{domain.score}</div>
            <div className="ring-score-sub">/100</div>
          </div>
        </div>
        <div className="ring-info">
          <div className="ring-domain-label">{domain.label}</div>
          <div className={`ring-domain-status ${tone}`}>{statusCopy(domain.score)}</div>
        </div>
        <div className="ring-hover-popup" style={{ borderColor: colors[index] }}>
          <div className="ring-popup-icon">{DOMAIN_ICONS[domain.key]}</div>
          <div className="ring-popup-score" style={{ color: colors[index] }}>{domain.score}/100</div>
          <div className="ring-popup-label">{domain.label}</div>
          <div className={`ring-popup-status ${tone}`}>{statusCopy(domain.score)}</div>
        </div>
      </div>
    )
  })}
</div>


      {/* Biggest Shifts*/}
<div className="section-heading">Biggest shifts</div>

<div className="toast-stack">
  {!dismissedWarnings.includes('priority') && (
    <div className={`toast-card toast-${statusTone(priority.score)}`}>
      <div className="toast-left">
        <div className="toast-icon-wrap">
          <span className="toast-emoji">{DOMAIN_ICONS[priority.key]}</span>
          <span className="toast-pulse"></span>
        </div>
      </div>
      <div className="toast-body">
        <div className="toast-tag">⚠ Priority 1</div>
        <div className="toast-title">{priority.label}</div>
        <div className="toast-score">{priority.score}<span>/100</span></div>
        <div className="toast-desc">This is your main area to focus on right now.</div>
      </div>
      <button className="toast-dismiss" onClick={() => dismissWarning('priority')}>×</button>
    </div>
  )}

  {!dismissedWarnings.includes('secondary') && (
    <div className={`toast-card toast-${statusTone(secondaryPriority.score)}`}>
      <div className="toast-left">
        <div className="toast-icon-wrap">
          <span className="toast-emoji">{DOMAIN_ICONS[secondaryPriority.key]}</span>
          <span className="toast-pulse"></span>
        </div>
      </div>
      <div className="toast-body">
        <div className="toast-tag">↑ Priority 2</div>
        <div className="toast-title">{secondaryPriority.label}</div>
        <div className="toast-score">{secondaryPriority.score}<span>/100</span></div>
        <div className="toast-desc">Next best lever to work on after your top priority.</div>
      </div>
      <button className="toast-dismiss" onClick={() => dismissWarning('secondary')}>×</button>
    </div>
  )}
</div>

{dismissedWarnings.length > 0 && (
  <div className="dismissed-section">
    <button className="dismissed-toggle" onClick={() => setShowHistory(!showHistory)}>
      {showHistory ? 'Hide' : 'Show'} dismissed ({dismissedWarnings.length})
    </button>
    {showHistory && (
      <div className="dismissed-list">
        {dismissedWarnings.includes('priority') && (
          <div className="dismissed-item">{priority.label} — main priority</div>
        )}
        {dismissedWarnings.includes('secondary') && (
          <div className="dismissed-item">{secondaryPriority.label} — next to watch</div>
        )}
      </div>
    )}
  </div>
)}

      
      {/* What Stands Out */}
<div className="section-heading">What stands out</div>

<div className="standout-grid">
  <div className="standout-card green">
    <img className="standout-img" src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=200&q=80" alt="strongest" />
    <div className="standout-label">Strongest</div>
    <div className="standout-domain">{strongest.label}</div>
    <div className="standout-score">{strongest.score}/100</div>
    <div className="standout-bar-track">
      <div className="standout-bar-fill green" style={{ '--target-width': `${strongest.score}%` }}></div>
    </div>
  </div>
  <div className="standout-card red">
    <img className="standout-img" src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&q=80" alt="focus" />
    <div className="standout-label">Focus here</div>
    <div className="standout-domain">{priority.label}</div>
    <div className="standout-score">{priority.score}/100</div>
    <div className="standout-bar-track">
      <div className="standout-bar-fill red" style={{ '--target-width': `${priority.score}%` }}></div>
    </div>
  </div>
  {selectedSleepBand && (
    <div className="standout-card blue">
      <img className="standout-img" src="https://images.unsplash.com/photo-1586042091284-bd35c8c1d917?w=200&q=80" alt="sleep" />
      <div className="standout-label">Your sleep</div>
      <div className="standout-domain">{selectedSleepBand.midpoint}h avg</div>
      <div className="standout-score">Aus avg {SLEEP_AVERAGE_18_24.overall}h</div>
      <div className="standout-bar-track">
        <div className="standout-bar-fill blue" style={{ '--target-width': `${(selectedSleepBand.midpoint / 10) * 100}%` }}></div>
      </div>
    </div>
  )}
  <div className="standout-card amber">
    <img className="standout-img" src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=80" alt="overall" />
    <div className="standout-label">Overall vibe</div>
    <div className="standout-domain">{snapshot.overallScore}/100</div>
    <div className="standout-score">{snapshot.overallInterpretation}</div>
    <div className="standout-bar-track">
      <div className="standout-bar-fill amber" style={{ '--target-width': `${snapshot.overallScore}%` }}></div>
    </div>
  </div>
</div>

      {/* Reads for You */}
      <div className="section-heading">Reads for you</div>

      <div className="reads-grid">
        {recommendedArticles.map((article) => (
          <Link key={article.id} className="read-card" to="/articles">
            <img className="read-img" src={article.image} alt={article.title} />
            <div className="read-body">
              <div className={`read-tag ${article.topic}`}>{article.topic.replace('_', ' ')}</div>
              <div className="read-title">{article.title}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="section-heading">Sleep decoded</div>
      <SleepDurationChart userSleepBand={selectedSleepBand} />

      <div className="section-heading">Movement decoded</div>
      <PhysicalActivityChart userActivityBand={selectedActivityBand} />

    </div>
  )
}

export default Dashboard