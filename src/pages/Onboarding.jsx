import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Onboarding.css'

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }
  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="ob-wrap">
      <div className="ob-progress-row">
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
        <div className="ob-step-label">Step {step} of {totalSteps}</div>
      </div>

      <div className="ob-card">

        {step === 1 && (
          <div>
            <div className="ob-eyebrow">Sleep Schedule</div>
            <div className="ob-title">Tell us about your sleep</div>
            <div className="ob-desc">Sleep consistency matters more than duration. Help us understand your typical routine.</div>

            <label className="field-label">Usual bedtime</label>
            <select className="time-input">
              <option>9 PM</option>
              <option>10 PM</option>
              <option>11 PM</option>
              <option>12 AM</option>
              <option>1 AM</option>
              <option>2 AM</option>
            </select>

            <label className="field-label">Usual wake-up time</label>
            <select className="time-input">
              <option>5 AM</option>
              <option>6 AM</option>
              <option>7 AM</option>
              <option>8 AM</option>
              <option>9 AM</option>
            </select>

            <label className="field-label">How consistent is your schedule?</label>
            <div className="option-grid cols-3">
              <button className="opt-btn">Very consistent</button>
              <button className="opt-btn">Somewhat irregular</button>
              <button className="opt-btn">Very irregular</button>
            </div>

            <div className="ob-footer">
              <button className="btn-next full" onClick={nextStep}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="ob-eyebrow">Pre-sleep Habits</div>
            <div className="ob-title">How do you wind down before bed?</div>
            <div className="ob-desc">Screen use within an hour of sleeping can disrupt memory consolidation.</div>

            <label className="field-label">How often do you use screens within 1 hour of bedtime?</label>
            <div className="option-grid cols-1">
              <button className="opt-btn">Almost every night</button>
              <button className="opt-btn">A few times a week</button>
              <button className="opt-btn">Rarely or never</button>
            </div>

            <div className="ob-footer">
              <button className="btn-back" onClick={prevStep}>← Back</button>
              <button className="btn-next" onClick={nextStep}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="ob-eyebrow">Study Routine</div>
            <div className="ob-title">What does your daily study look like?</div>
            <div className="ob-desc">Understanding your study load helps us identify whether your workload is contributing to fatigue.</div>

            <label className="field-label">Average daily study hours</label>
            <input type="range" min="0" max="12" defaultValue="4" className="slider" />

            <label className="field-label">Study style</label>
            <div className="option-grid cols-2">
              <button className="opt-btn">Long deep sessions</button>
              <button className="opt-btn">Short sprints</button>
              <button className="opt-btn">Mixed approach</button>
              <button className="opt-btn">Cramming before exams</button>
            </div>

            <div className="ob-footer">
              <button className="btn-back" onClick={prevStep}>← Back</button>
              <button className="btn-next" onClick={nextStep}>Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="ob-eyebrow">Your Result</div>
            <div className="ob-title">Your brain health profile is ready</div>
            <div className="ob-desc">Based on your sleep, screen habits, and study routine — here's what we found.</div>

            <div className="score-ring">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#EBF5FF" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#4A9EDB" strokeWidth="10"
                  strokeDasharray="314" strokeDashoffset="94" strokeLinecap="round"
                  transform="rotate(-90 60 60)"/>
              </svg>
              <div className="score-number">
                <div className="score-num">70</div>
                <div className="score-sub">/ 100</div>
              </div>
            </div>

            <div className="result-title">Building Good Habits</div>
            <div className="result-tagline">A few targeted changes to your sleep routine could noticeably improve your daily focus.</div>

            <div className="result-grid">
              <div className="result-item strength">
                <div className="result-item-label">Strength</div>
                <div className="result-item-text">Consistent study duration</div>
              </div>
              <div className="result-item strength">
                <div className="result-item-label">Strength</div>
                <div className="result-item-text">Sleep duration within 7–9h range</div>
              </div>
              <div className="result-item risk">
                <div className="result-item-label">Risk area</div>
                <div className="result-item-text">Late-night screen use disrupting memory</div>
              </div>
              <div className="result-item risk">
                <div className="result-item-label">Risk area</div>
                <div className="result-item-text">Irregular sleep schedule reducing attention</div>
              </div>
            </div>

            <div className="tip-box">
              <div className="tip-label">Today's tip</div>
              <div className="tip-text">Try putting your phone face-down 30 minutes before bed tonight.</div>
            </div>

            <div className="disclaimer">
              BrainBoost provides lifestyle awareness, not clinical or medical advice.
            </div>

            <button className="btn-next full" onClick={() => navigate('/dashboard')}>
              Go to my dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Onboarding