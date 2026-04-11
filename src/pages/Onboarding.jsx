import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

const RESPONSE_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']

const QUESTIONNAIRE_STEPS = [
  {
    key: 'sleep_rhythm',
    eyebrow: 'Domain 1',
    title: 'Sleep Rhythm',
    description: 'These questions look at how consistent and refreshing your sleep has been lately.',
    questions: [
      {
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
      {
        id: 'Q2',
        text: 'Over the past 2 weeks, how often did you feel your sleep was not refreshing?',
        options: RESPONSE_LABELS,
      },
      {
        id: 'Q3',
        text: 'Over the past 2 weeks, how often did you have trouble falling asleep or staying asleep?',
        options: RESPONSE_LABELS,
      },
    ],
  },
  {
    key: 'move_mode',
    eyebrow: 'Domain 2',
    title: 'Move Mode',
    description: 'Your movement habits help us estimate how much physical activity is supporting your brain health.',
    questions: [
      {
        id: 'Q4',
        text: 'On a usual day, how much moderate or vigorous physical activity do you get?',
        options: [
          'Less than 30 minutes',
          '30 minutes to less than 1 hour',
          '1 to less than 1.5 hours',
          '1.5 to less than 2 hours',
          '2 to less than 2.5 hours',
        ],
      },
      {
        id: 'Q5',
        text: 'How would you describe your usual daily movement?',
        options: [
          'Mostly sitting',
          'A little light movement',
          'Some walking or activity',
          'Active most of the day',
          'Very active most days',
        ],
      },
      {
        id: 'Q6',
        text: 'In a usual week, how often do you do exercise that makes you breathe harder, such as brisk walking, gym, sport, or cycling?',
        options: ['Never', '1 day', '2 days', '3-4 days', '5 or more days'],
      },
    ],
  },
  {
    key: 'cognitive_strain',
    eyebrow: 'Domain 3',
    title: 'Cognitive Strain',
    description: 'This section focuses on overload, mental fatigue, and day-to-day pressure.',
    questions: [
      {
        id: 'Q7',
        text: 'Over the past 2 weeks, how often have you felt mentally overloaded by study, work, or daily responsibilities?',
        options: RESPONSE_LABELS,
      },
      {
        id: 'Q8',
        text: 'Over the past 2 weeks, how often did you find it hard to focus because your mind felt tired or cluttered?',
        options: RESPONSE_LABELS,
      },
      {
        id: 'Q9',
        text: 'Over the past 2 weeks, how often did everyday demands feel like they were piling up faster than you could manage them?',
        options: RESPONSE_LABELS,
      },
    ],
  },
  {
    key: 'social_energy',
    eyebrow: 'Domain 4',
    title: 'Social Energy',
    description: 'Social connection can protect energy, resilience, and overall wellbeing.',
    questions: [
      {
        id: 'Q10',
        text: 'Over the past 2 weeks, how often did you feel meaningfully connected to other people?',
        options: RESPONSE_LABELS,
      },
      {
        id: 'Q11',
        text: 'When you feel stressed or drained, how often do you have someone you can talk to?',
        options: RESPONSE_LABELS,
      },
      {
        id: 'Q12',
        text: 'Over the past 2 weeks, how often did you feel socially drained or disconnected, even when around other people?',
        options: RESPONSE_LABELS,
      },
    ],
  },
]

const DOMAIN_CONFIG = {
  sleep_rhythm: { label: 'Sleep Rhythm', questions: ['Q1', 'Q2', 'Q3'], reverseScored: ['Q2', 'Q3'] },
  move_mode: { label: 'Move Mode', questions: ['Q4', 'Q5', 'Q6'], reverseScored: [] },
  cognitive_strain: { label: 'Cognitive Strain', questions: ['Q7', 'Q8', 'Q9'], reverseScored: ['Q7', 'Q8', 'Q9'] },
  social_energy: { label: 'Social Energy', questions: ['Q10', 'Q11', 'Q12'], reverseScored: ['Q12'] },
}

function reverseScore(value) {
  return 6 - value
}

function calculateDomainScore(responses, { questions, reverseScored }) {
  const raw = questions.reduce((sum, questionId) => {
    const value = responses[questionId]
    const adjustedValue = reverseScored.includes(questionId) ? reverseScore(value) : value
    return sum + adjustedValue
  }, 0)

  return Math.round(((raw - 3) / 12) * 100)
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

  const stepComplete = currentStep
    ? currentStep.questions.every((question) => responses[question.id])
    : true

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
    score: calculateDomainScore(responses, config),
  }))

  const overallScore = Math.round(
    domainScores.reduce((sum, domain) => sum + domain.score, 0) / domainScores.length,
  )
  const interpretation = interpretScore(overallScore)
  const insights = buildInsights(domainScores)

  const finishOnboarding = () => {
    const payload = {
      completedAt: new Date().toISOString(),
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
        <div className="ob-step-label">Step {step + 1} of {totalSteps}</div>
      </div>

      <div className="ob-card">
        {!isResultStep && (
          <div>
            <div className="ob-eyebrow">{currentStep.eyebrow}</div>
            <div className="ob-title">{currentStep.title}</div>
            <div className="ob-desc">{currentStep.description}</div>

            <div className="question-list">
              {currentStep.questions.map((question) => (
                <div key={question.id} className="question-card">
                  <label className="field-label">{question.text}</label>
                  <div className="option-grid cols-1">
                    {question.options.map((option, index) => {
                      const value = index + 1
                      const selected = responses[question.id] === value

                      return (
                        <button
                          key={option}
                          type="button"
                          className={`opt-btn answer-option ${selected ? 'selected' : ''}`}
                          onClick={() => setAnswer(question.id, value)}
                        >
                          <span className="answer-scale">{value}</span>
                          <span className="answer-label">{option}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {showValidation && (
              <div className="validation-text">Please answer all questions before continuing.</div>
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
              This is a non-clinical lifestyle snapshot based on your answers across sleep, movement,
              cognitive strain, and social energy.
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
              Your score is the average of four domain scores: Sleep Rhythm, Move Mode, Cognitive
              Strain, and Social Energy.
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
                Some questions are reverse-scored so that a higher final score always reflects
                stronger current habits and lower day-to-day strain.
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
