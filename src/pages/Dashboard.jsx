import { Link, useLocation, Navigate } from 'react-router-dom'
import './Dashboard.css'
import { ARTICLES } from '../data/articles'
import { getRecommendedArticles } from '../utils/recommendations'
import SleepDurationChart from '../components/SleepDurationChart'
import PhysicalActivityChart from '../components/PhysicalActivityChart'

const DEFAULT_SNAPSHOT = {
  overallScore: 70,
  overallInterpretation: 'moderate, room to improve',
  responses: {
    Q1: 3,
  },
  domainScores: [
    { key: 'sleep_rhythm', label: 'Sleep Rhythm', score: 67 },
    { key: 'move_mode', label: 'Move Mode', score: 75 },
    { key: 'cognitive_strain', label: 'Cognitive Strain', score: 58 },
    { key: 'social_energy', label: 'Social Energy', score: 79 },
  ],
}

const SLEEP_AVERAGE_18_24 = {
  overall: 7.6,
  weeknight: 7.51,
  weekend: 7.59,
}

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

function insightCopy(key) {
  const copy = {
    sleep_rhythm: 'Steadier sleep timing and more refreshing rest support memory, focus, and recovery during study or work-heavy weeks.',
    move_mode: 'Regular movement can support energy, mood, and concentration, especially when daily life becomes desk-heavy or screen-heavy.',
    cognitive_strain: 'Lower cognitive strain usually means better capacity for concentration, learning, and managing uni, work, and life pressure.',
    social_energy: 'Feeling connected to other people can buffer stress and support resilience when young adult life starts to feel isolating or draining.',
  }

  return copy[key]
}

function Dashboard() {
  const location = useLocation()
  const storedSnapshot = localStorage.getItem('brainboostSnapshot')
  const snapshot = location.state ?? (storedSnapshot ? JSON.parse(storedSnapshot) : DEFAULT_SNAPSHOT)

  if (!snapshot) {
    return <Navigate to="/onboarding" replace />
  }

  const sortedDomains = [...snapshot.domainScores].sort((a, b) => b.score - a.score)
  const strongest = sortedDomains[0]
  const priority = sortedDomains[sortedDomains.length - 1]
  const secondaryPriority = sortedDomains[sortedDomains.length - 2]
  const recommendedArticles = getRecommendedArticles(snapshot, ARTICLES, 3)
  const selectedSleepBand = SLEEP_BANDS[snapshot.responses?.Q1]
  const selectedActivityBand = ACTIVITY_BANDS[snapshot.responses?.Q4]
  const sleepDifference = selectedSleepBand
    ? Math.abs(selectedSleepBand.midpoint - SLEEP_AVERAGE_18_24.overall).toFixed(1)
    : null
  const sleepComparison = selectedSleepBand
    ? selectedSleepBand.midpoint >= SLEEP_AVERAGE_18_24.overall
      ? 'slightly above'
      : 'slightly below'
    : null
  const sleepSummary = selectedSleepBand
    ? `You told us you usually sleep ${selectedSleepBand.label}. For people aged 18-24, the average is about ${SLEEP_AVERAGE_18_24.overall.toFixed(1)} hours per night, and around ${selectedSleepBand.share}% fall into the same sleep range as you.`
    : null

  const today = new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <div className="dash-greeting">Your latest check-in</div>
          <div className="dash-name">Your Brain Vibe</div>
        </div>
        <div className="dash-date">{today}</div>
      </div>

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
          <div className="hero-score-sub">
            Built from your sleep, movement, stress load, and social energy
          </div>
        </div>
        <div className="hero-right">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
            <circle
              cx="45"
              cy="45"
              r="36"
              fill="none"
              stroke="rgba(93,202,165,0.8)"
              strokeWidth="8"
              strokeDasharray="226"
              strokeDashoffset={226 - (226 * snapshot.overallScore) / 100}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
          </svg>
        </div>
      </div>

      <div className="metric-row">
        {snapshot.domainScores.map((domain) => {
          const tone = statusTone(domain.score)

          return (
            <div key={domain.key} className="metric-card">
              <div className={`metric-icon ${tone}`}>{domain.score}</div>
              <div className="metric-label">{domain.label}</div>
              <div className="metric-value">
                {domain.score}
                <span className="metric-unit">/100</span>
              </div>
              <div className="metric-bar-track">
                <div className={`metric-bar-fill ${tone}`} style={{ width: `${domain.score}%` }}></div>
              </div>
              <div className={`metric-status ${tone}`}>{statusCopy(domain.score)}</div>
            </div>
          )
        })}
      </div>

      <div className="section-heading">Biggest shifts</div>

      <div className="warning-card">
        <div className="warning-icon">1</div>
        <div className="warning-body">
          <div className="warning-title">{priority.label} is your main priority right now</div>
          <div className="warning-text">
            This scored {priority.score}/100, so it is the clearest place to start if you want the fastest lift.
          </div>
        </div>
      </div>

      <div className="warning-card red">
        <div className="warning-icon">2</div>
        <div className="warning-body">
          <div className="warning-title">{secondaryPriority.label} is the next area to watch</div>
          <div className="warning-text">
            This is the next best lever to work on after your top priority.
          </div>
        </div>
      </div>

      <div className="section-heading">What stands out</div>

      <div className="insight-card">
        <div className="insight-dot"></div>
        <div className="insight-text">
          <strong>{strongest.label} is your strongest domain.</strong> It scored {strongest.score}/100, which
          suggests you already have a solid habit stack in this area.
        </div>
      </div>
      {selectedSleepBand && (
        <div className="insight-card">
          <div className="insight-dot blue"></div>
          <div className="insight-text">
            <strong>Your sleep sits {sleepComparison} the age-group average.</strong> {sleepSummary} That is about{' '}
            {sleepDifference} hours away from the average benchmark.
          </div>
        </div>
      )}
      <div className="insight-card">
        <div className="insight-dot amber"></div>
        <div className="insight-text">
          <strong>{priority.label} is where your energy leaks the most right now.</strong> {insightCopy(priority.key)}
        </div>
      </div>
      <div className="insight-card">
        <div className="insight-dot blue"></div>
        <div className="insight-text">
          <strong>Your overall vibe is {snapshot.overallInterpretation}.</strong> Small changes in your lowest
          one or two domains should shift your next snapshot the most.
        </div>
      </div>

      <div className="section-heading">Reads for you</div>

      <div className="insight-card recommendation-stack">
        <div className="insight-dot"></div>
        <div className="insight-text">
          <strong>Start here.</strong> These reads are stacked from your lowest-scoring areas first, so you can
          focus on what actually moves the needle.
          <div className="dashboard-recommendations">
            {recommendedArticles.map((article) => (
              <Link key={article.id} className="dashboard-recommendation-link" to="/articles">
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="section-heading">Sleep decoded</div>

      <SleepDurationChart userSleepBand={selectedSleepBand} />

      <div className="section-heading">Movement decoded</div>

      <PhysicalActivityChart userActivityBand={selectedActivityBand} />
    </div>
  )
}

export default Dashboard
