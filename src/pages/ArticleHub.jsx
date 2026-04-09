import { useState } from 'react'
import './ArticleHub.css'

const articles = [
    {
      id: 0,
      topic: 'sleep',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80',
      title: 'The consequences of sleep deprivation on cognitive performance',
      source: 'Peer-reviewed',
      sourceBadge: 'peer',
      readTime: '4 min read',
      summary: 'Even mild sleep restriction accumulates into significant deficits in attention, working memory, and decision-making over time.',
    },
    {
      id: 1,
      topic: 'sleep',
      image: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&q=80',
      title: 'Facts about sleep for young Australians',
      source: 'Headspace',
      sourceBadge: 'headspace',
      readTime: '3 min read',
      summary: 'Why sleep timing, not just duration, is the key factor for young adults managing study and work.',
    },
    {
      id: 2,
      topic: 'activity',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      title: 'How exercise influences the brain: a neuroscience perspective',
      source: 'Peer-reviewed',
      sourceBadge: 'peer',
      readTime: '5 min read',
      summary: 'Physical activity triggers neuroplasticity and BDNF release — the biological basis for why movement improves memory.',
    },
    {
      id: 3,
      topic: 'screen',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
      title: 'Poor sleeping patterns in young Australian adults',
      source: 'ABC Health',
      sourceBadge: 'abc',
      readTime: '3 min read',
      summary: '60% of young Australians report irregular sleep. What the research says about screen habits and daytime functioning.',
    },
    {
      id: 4,
      topic: 'study',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
      title: 'Daily physical activity associates with hippocampus function',
      source: 'Peer-reviewed',
      sourceBadge: 'peer',
      readTime: '4 min read',
      summary: 'Structural brain changes linked to movement — what this means for students trying to retain information.',
    },
    {
      id: 5,
      topic: 'sleep',
      image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=400&q=80',
      title: "1 in 4 young Australians aren't satisfied with their sleep",
      source: 'AIHW',
      sourceBadge: 'aihw',
      readTime: '3 min read',
      summary: 'Dissatisfied sleepers score 34% lower on mental functioning — and many do not realise how much their habits affect performance.',
    },
  ]


function ArticleHub() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? articles : articles.filter(a => a.topic === filter)

  return (
    <div className="hub-wrap">
      <div className="hub-header">
        <div className="hub-title">Article Hub</div>
        <div className="hub-sub">Evidence-based reads from trusted Australian sources — curated for your brain health journey.</div>
      </div>

      <div className="filter-row">
        {['all', 'sleep', 'study', 'activity', 'screen'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All topics' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {filtered.map(a => (
          <div key={a.id} className="article-card" onClick={() => setSelected(a)}>
            <div className="article-cover">
  <img src={a.image} alt={a.title} className="article-cover-img" />
</div>
<div className="article-body">
              <div className="article-meta">
                <span className={`source-badge ${a.sourceBadge}`}>{a.source}</span>
                <span className="read-time">{a.readTime}</span>
              </div>
              <div className="article-title">{a.title}</div>
              <div className="article-summary">{a.summary}</div>
              <span className={`article-tag ${a.topic}`}>
                {a.topic.charAt(0).toUpperCase() + a.topic.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className={`modal-bar ${selected.topic}`}></div>
            <div className="modal-header">
              <div>
                <div className="modal-meta">
                  <span className={`source-badge ${selected.sourceBadge}`}>{selected.source}</span>
                  <span className="read-time">{selected.readTime}</span>
                </div>
                <div className="modal-title">{selected.title}</div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-summary">{selected.summary}</div>
              <div className="modal-source-box">
                <div>
                  <div className="modal-source-label">Source</div>
                  <div className="modal-source-name">{selected.source}</div>
                </div>
                <span className="modal-source-link">View original →</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleHub