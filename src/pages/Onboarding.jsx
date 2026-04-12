import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

const QUESTIONNAIRE_STEPS = [
  {
    key: 'sleep_rhythm',
    eyebrow: 'Domain 1',
    title: 'Sleep Rhythm',
    description:
      'A quick check on how much sleep you usually get so we can place your snapshot against healthy habit patterns.',
    question: {
      id: 'Q1',
      text: 'On most nights, how many hours of sleep do you usually get?',
      options: [
        'Less than 6 hours',
        '6 to less than 7 hours',
        '7 to less than 8 hours',
        '8 to less than 9 hours',
        '9 hours or more',
      ],
    },
  },
  {
    key: 'move_mode',
    eyebrow: 'Domain 2',
    title: 'Move Mode',
    description:
      'This helps us estimate how active your routine is across a usual week, not just on your best days.',
    question: {
      id: 'Q2',
      text: 'In a usual week, on how many days are you physically active for at least 30 minutes?',
      options: ['0 days', '1-2 days', '3-4 days', '5-6 days', '7 days'],
    },
  },
  {
    key: 'screen_exposure',
    eyebrow: 'Domain 3',
    title: 'Screen Exposure',
    description:
      'Late-evening screen time can shape sleep quality, focus, and mental reset, so this checks your daily screen load.',
    question: {
      id: 'Q3',
      text: 'On average, how many hours per day do you spend on screens, particularly during the late evening or before sleep?',
      options: [
        'Less than 2 hours',
        '2-4 hours',
        '4-6 hours',
        '6-8 hours',
        'More than 8 hours',
      ],
    },
  },
  {
    key: 'social_energy',
    eyebrow: 'Domain 4',
    title: 'Social Energy',
    description:
      'This looks at whether you have been feeling meaningfully connected to other people lately.',
    question: {
      id: 'Q4',
      text: 'Over the past 2 weeks, how often did you feel meaningfully connected to other people?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    },
  },
]

const DOMAIN_CONFIG = {
  sleep_rhythm: { questionId: 'Q1', label: 'Sleep Rhythm', reverse: false },
  move_mode: { questionId: 'Q2', label: 'Move Mode', reverse: false },
  screen_exposure: { questionId: 'Q3', label: 'Screen Exposure', reverse: true },
  social_energy: { questionId: 'Q4', label: 'Social Energy', reverse: false },
}

function reverseScore(value) {
  return 6 - value
}

function calculateDomainScore(value, reverse = false) {
  const adjusted = reverse ? reverseScore(value) : value
  return adjusted * 20
}

function interpretScore(score) {
  if (score >= 75) return 'strong current habits'
  if (score >= 50) return 'moderate, room to improve'
  if (score >= 25) return 'noticeable strain or weaker habits'
  return 'priority area for support'
}

function buildInsights(domainEntries) {
  const sorted = [...domainEntries].sort((a, b) => b.score - a.score)
  return {
    strengths: sorted.slice(0, 2),
    priorities: sorted.slice(-2).reverse(),
  }
}

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState({})
  const [showValidation, setShowValidation] = useState(false)
  const totalSteps = QUESTIONNAIRE_STEPS.length + 1

  const currentStep = QUESTIONNAIRE_STEPS[step]
  const isResultStep = step === QUESTIONNAIRE_STEPS.length

  const setAnswer = (questionId, value) => {
    setResponses((current) => ({
      ...current,
      [questionId]: value,
    }))
    setShowValidation(false)
  }

  const stepComplete = currentStep ? Boolean(responses[currentStep.question.id]) : true

  const nextStep = () => {
    if (!stepComplete) {
      setShowValidation(true)
      return
    }

    if (step < QUESTIONNAIRE_STEPS.length) {
      setStep(step + 1)
      setShowValidation(false)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
      setShowValidation(false)
    }
  }

  const domainScores = Object.entries(DOMAIN_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
    score: calculateDomainScore(responses[config.questionId], config.reverse),
  }))

  const adjustedScores = Object.values(DOMAIN_CONFIG).map((config) =>
    config.reverse ? reverseScore(responses[config.questionId]) : responses[config.questionId],
  )
  const overallScore = Math.round(
    (adjustedScores.reduce((sum, value) => sum + value, 0) / adjustedScores.length) * 20,
  )
  const interpretation = interpretScore(overallScore)
  const insights = buildInsights(domainScores)

  const finishOnboarding = () => {
    const payload = {
      completedAt: new Date().toISOString(),
      questionnaireVersion: 'iteration-1-final-4q',
      responses,
      overallScore,
      overallInterpretation: interpretation,
      domainScores,
    }

    localStorage.setItem('brainboostSnapshot', JSON.stringify(payload))
    navigate('/dashboard', { state: payload })
  }

  return (
    <div className="ob-wrap">
      <div className="ob-progress-row">
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
        </div>
        <div className="ob-step-label">
          Step {step + 1} of {totalSteps}
        </div>
      </div>

      <div className="ob-card">
        {!isResultStep && (
          <div>
            <div className="ob-eyebrow">{currentStep.eyebrow}</div>
            <div className="ob-title">{currentStep.title}</div>
            <div className="ob-desc">{currentStep.description}</div>

            <div className="question-list">
              <div className="question-card">
                <label className="field-label">{currentStep.question.text}</label>
                <div className="option-grid cols-1">
                  {currentStep.question.options.map((option, index) => {
                    const value = index + 1
                    const selected = responses[currentStep.question.id] === value

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`opt-btn answer-option ${selected ? 'selected' : ''}`}
                        onClick={() => setAnswer(currentStep.question.id, value)}
                      >
                        <span className="answer-scale">{value}</span>
                        <span className="answer-label">{option}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {showValidation && (
              <div className="validation-text">Please choose one answer before continuing.</div>
            )}

            <div className="ob-footer">
              {step > 0 ? (
                <button type="button" className="btn-back" onClick={prevStep}>
                  Back
                </button>
              ) : (
                <div className="btn-spacer"></div>
              )}
              <button type="button" className="btn-next" onClick={nextStep}>
                Continue
              </button>
            </div>
          </div>
        )}

        {isResultStep && (
          <div>
            <div className="ob-eyebrow">Your Result</div>
            <div className="ob-title">Your brain health snapshot is ready</div>
            <div className="ob-desc">
              This score is a quick, non-clinical snapshot of four everyday areas linked to brain
              health: sleep, movement, screen exposure, and social connection.
            </div>

            <div className="score-ring">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#EBF5FF" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#4A9EDB"
                  strokeWidth="10"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * overallScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="score-number">
                <div className="score-num">{overallScore}</div>
                <div className="score-sub">/ 100</div>
              </div>
            </div>

            <div className="result-title">{interpretation}</div>
            <div className="result-tagline">
              Your final score comes from four adjusted question scores, with screen exposure
              reverse-scored so a higher total always means stronger current habits.
            </div>

            <div className="result-grid">
              {insights.strengths.map((domain) => (
                <div key={`strength-${domain.key}`} className="result-item strength">
                  <div className="result-item-label">Stronger area</div>
                  <div className="result-item-text">
                    {domain.label}: {domain.score}/100
                  </div>
                </div>
              ))}
              {insights.priorities.map((domain) => (
                <div key={`priority-${domain.key}`} className="result-item risk">
                  <div className="result-item-label">Priority area</div>
                  <div className="result-item-text">
                    {domain.label}: {domain.score}/100
                  </div>
                </div>
              ))}
            </div>

            <div className="tip-box">
              <div className="tip-label">How scoring works</div>
              <div className="tip-text">
                Sleep, movement, and social energy score directly. Screen exposure is reverse-scored
                because more late-evening screen time is treated as a weaker protective habit.
              </div>
            </div>

            <div className="disclaimer">
              BrainBoost provides lifestyle awareness only. It is not a medical, psychological, or
              diagnostic assessment.
            </div>

            <div className="ob-footer">
              <button type="button" className="btn-back" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="btn-next" onClick={finishOnboarding}>
                Go to my dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Onboarding
