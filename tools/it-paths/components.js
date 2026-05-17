// IT Paths Explorer — all React components
// Main app components for the IT Paths Explorer
const { useState, useEffect, useMemo, useRef } = React;
// ============================================================
// TWEAKS — 3 theme variants
// ============================================================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
"theme": "dark",
"accentHue": 142,
"fontScale": 1
}/*EDITMODE-END*/;
const THEMES = {
editorial: {
name: "Editorial",
bg: "#fafaf7",
ink: "#111111",
muted: "#6b6b66",
cream: "#e8e4dc",
card: "#ffffff",
line: "rgba(17,17,17,0.12)",
shadow: "0 1px 0 rgba(17,17,17,0.06)",
serif: "'Instrument Serif', 'Times New Roman', serif",
sans: "'Inter Tight', system-ui, sans-serif",
mono: "'JetBrains Mono', ui-monospace, monospace"
},
dark: {
name: "Hacker Dark",
bg: "#0a0d0a",
ink: "#e8f5e8",
muted: "#7a8a7a",
cream: "#111a11",
card: "#0f140f",
line: "rgba(168, 230, 168, 0.14)",
shadow: "0 1px 0 rgba(0,0,0,0.5)",
serif: "'Instrument Serif', serif",
sans: "'Inter Tight', system-ui, sans-serif",
mono: "'JetBrains Mono', ui-monospace, monospace"
},
warm: {
name: "Warm Magazine",
bg: "#f5efe6",
ink: "#1a1511",
muted: "#7a6f61",
cream: "#ead9c0",
card: "#fcf7ef",
line: "rgba(26,21,17,0.14)",
shadow: "0 1px 0 rgba(26,21,17,0.08)",
serif: "'Instrument Serif', serif",
sans: "'Inter Tight', system-ui, sans-serif",
mono: "'JetBrains Mono', ui-monospace, monospace"
}
};
// ============================================================
// Jargon tooltip
// ============================================================
function Jargon({ term, children, theme }) {
const def = window.GLOSSARY[term] || window.GLOSSARY[term.toLowerCase()];
if (!def) return <span>{children}</span>;
return (
<span className="jargon" tabIndex={0}>
<span className="jargon-text">{children || term}</span>
<span className="jargon-tip" role="tooltip">
<strong>{term}</strong>
<br/>
{def}
</span>
</span>
);
}
// Auto-jargon: scan text and wrap known terms
function JargonText({ children }) {
const text = String(children);
const terms = Object.keys(window.GLOSSARY).sort((a,b) => b.length - a.length);
const pattern = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
const parts = [];
let lastIndex = 0;
let m;
let key = 0;
while ((m = pattern.exec(text)) !== null) {
if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
const matched = m[0];
const canonKey = Object.keys(window.GLOSSARY).find(k => k.toLowerCase() === matched.toLowerCase()) || matched;
parts.push(<Jargon key={key++} term={canonKey}>{matched}</Jargon>);
lastIndex = m.index + matched.length;
}
if (lastIndex < text.length) parts.push(text.slice(lastIndex));
return <>{parts}</>;
}
// ============================================================
// Image with fallback
// ============================================================
function SmartImage({ src, alt, style }) {
const [err, setErr] = useState(false);
if (err || !src) {
return (
<div style={{
...style,
background: 'repeating-linear-gradient(45deg, var(--cream), var(--cream) 8px, var(--bg) 8px, var(--bg) 16px)',
display: 'flex', alignItems: 'center', justifyContent: 'center',
color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11,
letterSpacing: '0.1em', textTransform: 'uppercase'
}}>
Replace image
</div>
);
}
return <img src={src} alt={alt} style={style} onError={() => setErr(true)} loading="lazy" />;
}
// ============================================================
// Tweaks Panel
// ============================================================
function TweaksPanel({ tweaks, setTweaks, visible, lang }) {
if (!visible) return null;
const t = window.T(lang);
const themeLabels = {
dark: t.theme_dark, editorial: t.theme_editorial, warm: t.theme_warm
};
const set = (k, v) => {
const next = { ...tweaks, [k]: v };
setTweaks(next);
window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
};
return (
<div className="tweaks-panel">
<div className="tweaks-title">{t.tweaks}</div>
<div className="tweak-row">
<label>{t.tweak_theme}</label>
<div className="theme-chips">
{Object.entries(THEMES).map(([k, th]) => (
<button key={k}
className={`chip ${tweaks.theme === k ? 'active' : ''}`}
onClick={() => set('theme', k)}>{themeLabels[k] || th.name}</button>
))}
</div>
</div>
<div className="tweak-row">
<label>{t.tweak_accent} <span className="mono">{tweaks.accentHue}°</span>
</label>
<input type="range" min="0" max="360" step="1"
value={tweaks.accentHue}
onChange={(e) => set('accentHue', Number(e.target.value))} />
</div>
<div className="tweak-row">
<label>{t.tweak_size} <span className="mono">{Math.round(tweaks.fontScale * 100)}%</span>
</label>
<input type="range" min="0.85" max="1.2" step="0.05"
value={tweaks.fontScale}
onChange={(e) => set('fontScale', Number(e.target.value))} />
</div>
</div>
);
}
Object.assign(window, { THEMES, TWEAK_DEFAULTS, Jargon, JargonText, SmartImage, TweaksPanel });

// --- PathCard, FilterBar, PathDetail, Quiz ---
// Path card, filters, path detail, quiz — the chunky stuff
const { useState: useStateV, useEffect: useEffectV, useMemo: useMemoV } = React;
// ============================================================
// Path Card
// ============================================================
function PathCard({ path, onOpen, lang }) {
const p = window.localizePath(path, lang);
return (
<article className="path-card" onClick={() => onOpen(path)}>
<div className="path-card-img-wrap">
<SmartImage src={p.image} alt={p.name}
style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
<div className="path-card-emoji">{p.emoji}</div>
</div>
<div className="path-card-body">
<div className="path-card-meta">
<span className="mono-label">{window.localizeCat(p.category, lang)}</span>
<span className="diff-pill" title={`Level ${path.difficulty}/5`}>
<span className="diff-label-text">{lang === 'id' ? 'LEVEL' : 'LEVEL'}</span>
{Array.from({length: 5}).map((_, i) => (
<span key={i} className={`diff-dot ${i < path.difficulty ? 'on' : ''}`}/>
))}
</span>
</div>
<h3 className="path-card-title">{p.name}</h3>
<p className="path-card-tagline">{p.tagline}</p>
<div className="path-card-footer">
<span className="mono-label salary">{p.salary}</span>
<span className="open-arrow">→</span>
</div>
</div>
</article>
);
}
// ============================================================
// Filter Bar
// ============================================================
const CATEGORIES_RAW = ["All", "Building things", "Data & AI", "Security & infrastructure", "Creative & design"];
function FilterBar({ filters, setFilters, total, visible, lang, searchQuery, setSearchQuery }) {
const t = window.T(lang);
const earnFilters = [
{ k: "all", label: t.earn_all },
{ k: "job", label: t.earn_job },
{ k: "freelance", label: t.earn_freelance },
{ k: "hobby", label: t.earn_hobby }
];
const diffLabels = { 1: t.diff_1, 2: t.diff_2, 3: t.diff_3, 4: t.diff_4, 5: t.diff_5 };
return (
<div className="filter-bar">
<div className="filter-group">
<div className="mono-label">{t.filter_field}</div>
<div className="chip-row">
{CATEGORIES_RAW.map(c => (
<button key={c}
className={`chip ${filters.category === c ? 'active' : ''}`}
onClick={() => setFilters({...filters, category: c})}>
{c === 'All' ? t.cat_all : window.localizeCat(c, lang)}
</button>
))}
</div>
</div>
<div className="filter-group">
<div className="mono-label">{t.filter_earn}</div>
<div className="chip-row">
{earnFilters.map(e => (
<button key={e.k}
className={`chip ${filters.earning === e.k ? 'active' : ''}`}
onClick={() => setFilters({...filters, earning: e.k})}>{e.label}</button>
))}
</div>
</div>
<div className="filter-group">
<div className="mono-label">{t.filter_diff}</div>
<div className="chip-row">
{[1,2,3,4,5].map(d => (
<button key={d}
className={`chip ${filters.difficulty === d ? 'active' : ''}`}
onClick={() => setFilters({...filters, difficulty: d})}>
{diffLabels[d]}
</button>
))}
</div>
</div>
<div className="filter-group">
<div className="mono-label">{t.filter_math}</div>
<div className="chip-row">
<button className={`chip ${filters.math === 'any' ? 'active' : ''}`} onClick={() => setFilters({...filters, math: 'any'})}>{t.math_any}</button>
<button className={`chip ${filters.math === 'light' ? 'active' : ''}`} onClick={() => setFilters({...filters, math: 'light'})}>{t.math_light}</button>
<button className={`chip ${filters.math === 'heavy' ? 'active' : ''}`} onClick={() => setFilters({...filters, math: 'heavy'})}>{t.math_heavy}</button>
</div>
</div>
<div className="search-wrap filter-search">
<svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
<circle cx="11" cy="11" r="8"/>
<path d="m21 21-4.3-4.3"/>
</svg>
<input
className="search-input"
type="search"
placeholder={t.search_placeholder || "Search paths, skills, roles…"}
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
/>
{!searchQuery && (
<span className="search-kbd">
<span>⌘</span>
<span>K</span>
</span>
)}
{searchQuery && (
<button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
)}
</div>
<div className="filter-count">
<span className="mono-label">{t.filter_count.replace('{n}', visible).replace('{total}', total)}</span>
</div>
</div>
);
}
// ============================================================
// Path Detail Modal
// ============================================================
function PathDetail({ path, onClose, onSimulate, lang }) {
useEffectV(() => {
if (!path) return;
const onKey = (e) => { if (e.key === 'Escape') onClose(); };
document.addEventListener('keydown', onKey);
document.body.style.overflow = 'hidden';
return () => {
document.removeEventListener('keydown', onKey);
document.body.style.overflow = '';
};
}, [path]);
if (!path) return null;
const t = window.T(lang);
const p = window.localizePath(path, lang);
const diffLabels = { 1: t.diff_label_1, 2: t.diff_label_2, 3: t.diff_label_3, 4: t.diff_label_4, 5: t.diff_label_5 };
return (
<div className="detail-overlay" onClick={onClose}>
<div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
<button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
<div className="detail-hero">
<SmartImage src={p.image} alt={p.name}
style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
<div className="detail-hero-overlay">
<div className="mono-label">{window.localizeCat(p.category, lang)}</div>
<h1 className="detail-title">{p.emoji} {p.name}</h1>
<p className="detail-tagline">{p.tagline}</p>
</div>
</div>
<div className="detail-body">
<section className="detail-section">
<h3 className="section-h">{t.sec_what}</h3>
<p className="body-text">
<JargonText>{p.whatYouDo}</JargonText>
</p>
</section>
<div className="detail-grid">
<section className="detail-section">
<h3 className="section-h">{t.sec_tools}</h3>
<div className="tool-chips">
{p.tools.map(tool =>
<span key={tool} className="tool-chip">
<Jargon term={tool}>{tool}</Jargon>
</span>)}
</div>
</section>
<section className="detail-section">
<h3 className="section-h">{t.sec_pay}</h3>
<div className="salary-big">{p.salary}</div>
<div className="mono-label muted">{t.pay_note}</div>
</section>
<section className="detail-section">
<h3 className="section-h">{t.sec_diff}</h3>
<div className="diff-row">
{Array.from({length: 5}).map((_, i) => (
<span key={i} className={`diff-dot big ${i < p.difficulty ? 'on' : ''}`}/>
))}
<span className="diff-label">{diffLabels[p.difficulty]}</span>
</div>
<div className="mono-label muted" style={{marginTop: 8}}>
{p.mathHeavy ? t.math_heavy_y : t.math_heavy_n}
</div>
</section>
<section className="detail-section">
<h3 className="section-h">{t.sec_earn}</h3>
<div className="earn-row">
{p.earningStyles.includes('job') && <span className="earn-badge">{t.badge_job}</span>}
{p.earningStyles.includes('freelance') && <span className="earn-badge">{t.badge_freelance}</span>}
{p.earningStyles.includes('hobby') && <span className="earn-badge">{t.badge_hobby}</span>}
</div>
</section>
</div>
<section className="detail-section">
<h3 className="section-h">{t.sec_day}</h3>
<ul className="day-list">
{p.dayInLife.map((d, i) => (
<li key={i}>
<span className="day-time">{['9am','11am','2pm','4pm'][i] || '—'}</span>
<span>
<JargonText>{d}</JargonText>
</span>
</li>
))}
</ul>
</section>
<section className="detail-section">
<h3 className="section-h">{t.sec_road}</h3>
<ol className="roadmap">
{p.roadmap.map((r, i) => (
<li key={i} className="roadmap-step">
<div className="roadmap-num">{String(i+1).padStart(2,'0')}</div>
<div className="roadmap-body">
<div className="roadmap-head">
<strong>{r.step}</strong>
<span className="mono-label">{r.weeks}</span>
</div>
<p>
<JargonText>{r.what}</JargonText>
</p>
</div>
</li>
))}
</ol>
</section>
<section className="detail-section encouragement">
<p>
<em>{lang === 'id' ? 'Ingat:' : 'Remember:'}</em> {t.encourage.replace(/^Remember:\s*/, '').replace(/^Ingat:\s*/, '')}
</p>
</section>
<section className="detail-section simulate-section">
<div className="simulate-inner">
<div>
<div className="mono-label">{lang === 'id' ? 'Rasakan sendiri' : 'Try it yourself'}</div>
<h3 className="simulate-h">{lang === 'id' ? 'Simulasikan pekerjaannya' : 'Simulate the job'}</h3>
<p className="simulate-sub">
{path.id === 'promptai'
? (lang === 'id'
? 'Coba jadi Prompt Engineer — kerjakan tugas klien nyata dengan AI sungguhan.'
: 'Step into a Prompt Engineer\'s shoes — tackle a real client brief with a live AI.')
: (lang === 'id'
? 'Simulasi untuk jalur ini belum tersedia. Masih dalam pengembangan.'
: 'Simulation for this path isn\'t ready yet. Coming soon.')}
</p>
</div>
{path.id === 'promptai' ? (
<button className="btn-primary simulate-btn" onClick={() => onSimulate(path)}>
▶ {lang === 'id' ? 'Mulai simulasi' : 'Start simulation'}
</button>
) : (
<button className="btn-primary simulate-btn disabled" disabled title={lang === 'id' ? 'Segera hadir' : 'Coming soon'}>
{lang === 'id' ? 'Segera hadir' : 'Coming soon'}
</button>
)}
</div>
</section>
</div>
</div>
</div>
);
}
// ============================================================
// Quiz
// ============================================================
function Quiz({ onDone, onClose, lang }) {
const [step, setStep] = useStateV(0);
const [answers, setAnswers] = useStateV([]);
const [selected, setSelected] = useStateV([]);
const t = window.T(lang);
const QUIZ = window.QUIZ_I18N[lang] || window.QUIZ_I18N.en;
const q = QUIZ[step];
const isMulti = q.multi;
const toggle = (idx) => {
if (isMulti) {
setSelected(selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]);
} else {
// Single select: go right away
const picked = [q.options[idx]];
next(picked);
}
};
const next = (picks) => {
const chosen = picks || selected.map(i => q.options[i]);
if (!picks && chosen.length === 0) return;
const nextAnswers = [...answers, chosen];
setSelected([]);
if (step + 1 >= QUIZ.length) {
const recs = scoreQuiz(nextAnswers);
onDone(recs);
} else {
setAnswers(nextAnswers);
setStep(step + 1);
}
};
const back = () => {
if (step === 0) return;
setAnswers(answers.slice(0, -1));
setSelected([]);
setStep(step - 1);
};
const progress = (step / QUIZ.length) * 100;
return (
<div className="detail-overlay" onClick={onClose}>
<div className="quiz-sheet" onClick={(e) => e.stopPropagation()}>
<button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
<div className="quiz-head">
<div className="mono-label">{t.quiz_q_of.replace('{n}', step + 1).replace('{total}', QUIZ.length)}</div>
<div className="progress-bar">
<div className="progress-fill" style={{ width: `${progress}%` }} />
</div>
</div>
<h2 className="quiz-q">{q.q}</h2>
{isMulti && <div className="quiz-hint mono-label">{t.quiz_multi_hint}</div>}
<div className="quiz-options">
{q.options.map((opt, i) => {
const on = isMulti && selected.includes(i);
return (
<button key={i}
className={`quiz-option ${on ? 'selected' : ''}`}
onClick={() => toggle(i)}>
<span className="quiz-option-letter">
{isMulti ? (on ? '✓' : '○') : String.fromCharCode(65 + i)}
</span>
<span>{opt.label}</span>
</button>
);
})}
</div>
<div className="quiz-footer">
{step > 0 ? <button className="back-btn" onClick={back}>← {t.quiz_back}</button> : <span/>}
{isMulti && (
<button
className="btn-primary"
disabled={selected.length === 0}
style={{opacity: selected.length === 0 ? 0.35 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer'}}
onClick={() => next()}>
{step + 1 >= QUIZ.length ? t.quiz_see_results : t.quiz_continue} →
</button>
)}
</div>
</div>
</div>
);
}
function scoreQuiz(answerGroups) {
const scores = {};
window.PATHS.forEach(p => scores[p.id] = 0);
const vibeWants = [];
const catWants = [];
let mathPref = 0;
let difficultyMax = 5;
let earning = null;
// answerGroups is array of arrays (one array per question; each inner array has 1+ picks)
answerGroups.forEach(picks => {
picks.forEach(a => {
if (a.vibes) vibeWants.push(...a.vibes);
if (a.categories) catWants.push(...a.categories);
if (typeof a.mathPref === 'number') mathPref = a.mathPref;
if (a.difficultyMax) difficultyMax = Math.min(difficultyMax, a.difficultyMax);
if (a.earning) earning = a.earning;
});
});
window.PATHS.forEach(p => {
// Vibe match
p.vibes.forEach(v => {
const count = vibeWants.filter(x => x === v).length;
scores[p.id] += count * 3;
});
// Category match
if (catWants.includes(p.category)) scores[p.id] += 5;
// Math
if (mathPref > 0 && p.mathHeavy) scores[p.id] += 2;
if (mathPref < 0 && !p.mathHeavy) scores[p.id] += 2;
if (mathPref < 0 && p.mathHeavy) scores[p.id] -= 3;
// Difficulty ceiling
if (p.difficulty > difficultyMax) scores[p.id] -= 4;
// Earning style
if (earning && !p.earningStyles.includes(earning)) scores[p.id] -= 5;
if (earning && p.earningStyles.includes(earning)) scores[p.id] += 2;
});
const sorted = [...window.PATHS].sort((a,b) => scores[b.id] - scores[a.id]);
return sorted.slice(0, 5).map(p => ({ path: p, score: scores[p.id] }));
}
// ============================================================
// Quiz Results
// ============================================================
function QuizResults({ results, onOpen, onRetake, onClose, lang }) {
const t = window.T(lang);
return (
<div className="detail-overlay" onClick={onClose}>
<div className="results-sheet" onClick={(e) => e.stopPropagation()}>
<button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
<div className="mono-label">{t.results_match}</div>
<h2 className="results-title">{t.results_title}</h2>
<p className="muted">{t.results_sub}</p>
<div className="results-list">
{results.map(({ path }, i) => {
const p = window.localizePath(path, lang);
return (
<button key={path.id} className="result-row" onClick={() => onOpen(path)}>
<div className="result-rank">{i + 1}</div>
<div className="result-img">
<SmartImage src={p.image} alt={p.name}
style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
</div>
<div className="result-body">
<div className="result-name">{p.emoji} {p.name}</div>
<div className="result-tag">{p.tagline}</div>
</div>
<div className="result-arrow">→</div>
</button>
);
})}
</div>
<div className="results-actions">
<button className="btn-secondary" onClick={onRetake}>{t.results_retake}</button>
<button className="btn-primary" onClick={onClose}>{t.results_browse}</button>
</div>
</div>
</div>
);
}
Object.assign(window, { PathCard, FilterBar, PathDetail, Quiz, QuizResults });

// --- PromptEngineerSim ---
// =========================================================================
// Job Simulations — interactive "try the job" experiences
// Currently implemented: promptai (AI / Prompt Engineer)
// =========================================================================
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;
// -------------------------------------------------------------------------
// Prompt Engineer missions
// -------------------------------------------------------------------------
const PE_MISSIONS_EN = [
{
id: "customer-support",
title: "Customer support bot for a shoe store",
client: "Zara of Jakarta — an online sneaker shop",
brief: "Our customers keep asking the same 5 things: shipping times, return policy, size guide, stock, and discounts. Build a prompt for an AI bot that answers them — but ALWAYS in a friendly, playful tone and NEVER makes up shipping times. If unsure, it should apologize and offer to escalate to a human.",
testInput: "Hey, when will my order #8812 arrive? Also do you have size 42 in the white Airforces?",
criteria: [
{ key: "role", label: "Sets a clear role for the AI", hint: "tell it what kind of assistant it is" },
{ key: "tone", label: "Specifies a friendly, playful tone", hint: "\"friendly\", \"playful\", or similar" },
{ key: "nohallucinate", label: "Tells AI not to invent shipping times", hint: "e.g. \"don't make up\" or \"only use provided info\"" },
{ key: "escalate", label: "Has an escalation path to humans", hint: "when unsure → offer a human" },
{ key: "scope", label: "Scopes the topics (the 5 areas)", hint: "mention shipping, returns, sizes, stock, discounts" }
]
},
{
id: "email-summarizer",
title: "Daily email digest for a busy founder",
client: "Rina — a SaaS founder drowning in email",
brief: "Write a prompt that takes a bunch of unread emails and produces a 1-paragraph digest at the top, then a bulleted list grouped by priority (Urgent / Today / Can wait). Each bullet must have the sender, a 1-line summary, and a suggested action. No fluff, no 'I hope you're well'.",
testInput: "From: legal@stripe.com — Terms of service updates effective Dec 1 (action: review within 30 days).\nFrom: alex@partnerco — wants to schedule a call Friday about integration.\nFrom: newsletter@indie.hackers — weekly digest.",
criteria: [
{ key: "structure", label: "Specifies the output structure", hint: "1-paragraph digest + bulleted list" },
{ key: "grouping", label: "Groups by priority buckets", hint: "Urgent / Today / Can wait" },
{ key: "fields", label: "Requires sender + summary + action", hint: "3 fields per bullet" },
{ key: "concise", label: "Demands conciseness / no filler", hint: "no fluff, pleasantries removed" },
{ key: "examples", label: "Gives an example or format", hint: "showing is better than telling" }
]
},
{
id: "code-reviewer",
title: "Code review assistant for junior devs",
client: "Budi — engineering manager at an e-commerce company",
brief: "Build a prompt that reviews a junior developer's JavaScript code. It should: point out bugs first, then style issues, then suggest improvements — but in an encouraging tone (never mean). Keep feedback to max 5 bullet points. If code is great, say so. Use markdown.",
testInput: "function getUser(id) {\n  fetch('/api/user/' + id).then(r => r.json()).then(u => console.log(u));\n}",
criteria: [
{ key: "role", label: "Defines the reviewer role clearly", hint: "tell it the context: junior dev, JS code" },
{ key: "order", label: "Specifies order: bugs → style → improvements", hint: "mentions the 3 buckets in order" },
{ key: "tone", label: "Demands encouraging / kind tone", hint: "\"encouraging\", \"never mean\", \"kind\"" },
{ key: "limit", label: "Caps output length", hint: "max 5 bullets" },
{ key: "format", label: "Requests markdown formatting", hint: "markdown / bullets / headings" }
]
}
];
const PE_MISSIONS_ID = [
{
id: "customer-support",
title: "Bot customer support untuk toko sepatu",
client: "Zara dari Jakarta — toko sneaker online",
brief: "Pelanggan kami sering nanya 5 hal yang sama: lama pengiriman, kebijakan retur, panduan ukuran, stok, dan diskon. Bikin prompt buat bot AI yang jawab pertanyaan itu — tapi SELALU dengan nada ramah & playful, dan TIDAK PERNAH ngarang-ngarang lama pengiriman. Kalau ragu, bot harus minta maaf & tawarkan buat eskalasi ke manusia.",
testInput: "Halo, kapan ya pesanan #8812 sampai? Terus stok Airforces putih ukuran 42 masih ada nggak?",
criteria: [
{ key: "role", label: "Tetapkan peran AI dengan jelas", hint: "kasih tahu dia tipe asisten apa" },
{ key: "tone", label: "Tentukan nada ramah & playful", hint: "\"ramah\", \"playful\", atau sejenis" },
{ key: "nohallucinate", label: "Larang AI ngarang lama pengiriman", hint: "misalnya \"jangan mengarang\" atau \"pakai info yang disediakan aja\"" },
{ key: "escalate", label: "Ada jalur eskalasi ke manusia", hint: "kalau ragu → tawarkan manusia" },
{ key: "scope", label: "Batasi topik (5 area itu)", hint: "sebut pengiriman, retur, ukuran, stok, diskon" }
]
},
{
id: "email-summarizer",
title: "Ringkasan email harian buat founder sibuk",
client: "Rina — founder SaaS yang kebanjiran email",
brief: "Tulis prompt yang ambil kumpulan email belum dibaca lalu bikin ringkasan 1 paragraf di atas, lalu daftar poin dikelompokin berdasarkan prioritas (Urgent / Hari ini / Bisa nanti). Tiap poin harus ada pengirim, ringkasan 1 baris, dan saran aksi. Nggak usah basa-basi, nggak usah 'Semoga sehat selalu'.",
testInput: "Dari: legal@stripe.com — Update syarat layanan berlaku 1 Des (aksi: review dalam 30 hari).\nDari: alex@partnerco — mau jadwalin call Jumat soal integrasi.\nDari: newsletter@indie.hackers — rangkuman mingguan.",
criteria: [
{ key: "structure", label: "Tentukan struktur output", hint: "ringkasan 1 paragraf + daftar poin" },
{ key: "grouping", label: "Kelompokkan berdasar prioritas", hint: "Urgent / Hari ini / Bisa nanti" },
{ key: "fields", label: "Minta pengirim + ringkasan + aksi", hint: "3 field per poin" },
{ key: "concise", label: "Minta padat, tanpa basa-basi", hint: "hapus basa-basi, sapaan" },
{ key: "examples", label: "Kasih contoh atau format", hint: "nunjukin lebih efektif dari nyuruh" }
]
},
{
id: "code-reviewer",
title: "Asisten review kode buat junior dev",
client: "Budi — engineering manager di perusahaan e-commerce",
brief: "Bikin prompt yang review kode JavaScript junior dev. Harus: tunjukkan bug dulu, lalu masalah gaya, lalu saran perbaikan — tapi dengan nada yang menyemangati (tidak pernah nyinyir). Feedback maks 5 poin. Kalau kodenya bagus, bilang. Pakai markdown.",
testInput: "function getUser(id) {\n  fetch('/api/user/' + id).then(r => r.json()).then(u => console.log(u));\n}",
criteria: [
{ key: "role", label: "Definisikan peran reviewer jelas", hint: "konteks: junior dev, kode JS" },
{ key: "order", label: "Tentukan urutan: bug → gaya → perbaikan", hint: "sebut 3 kategori itu berurutan" },
{ key: "tone", label: "Minta nada menyemangati / sopan", hint: "\"menyemangati\", \"tidak nyinyir\", \"sopan\"" },
{ key: "limit", label: "Batasi panjang output", hint: "maks 5 poin" },
{ key: "format", label: "Minta format markdown", hint: "markdown / poin / heading" }
]
}
];
// -------------------------------------------------------------------------
// Scoring heuristics — match keywords in the user's prompt (case-insensitive)
// -------------------------------------------------------------------------
const PE_MATCHERS = {
// customer-support
role: (p) => /\b(you are|you'?re|act as|kamu adalah|kamu merupakan|berperan|your role|peran kamu|sebagai)\b/i.test(p),
tone: (p) => /\b(friendly|playful|cheerful|casual|warm|kind|ramah|playful|santai|hangat|ceria|akrab)\b/i.test(p),
nohallucinate: (p) => /\b(don'?t (make|invent|guess)|do not (make|invent|guess)|never (make|invent|guess)|only use|based on|only if|hanya|jangan (meng)?arang|jangan (me)?nebak|jangan ber?asumsi|berdasarkan info|pakai info)\b/i.test(p),
escalate: (p) => /\b(human|agent|staff|escalat|hand off|transfer|manusia|petugas|eskalasi|diteruskan|teruskan|sambungkan)\b/i.test(p),
scope: (p) => {
const topics = ['shipp|pengirim|kirim', 'return|retur|pengembalian', 'size|ukuran', 'stock|stok|tersedia', 'discount|diskon|promo'];
const hits = topics.filter(t => new RegExp(t, 'i').test(p)).length;
return hits >= 3;
},
// email-summarizer
structure: (p) => /\b(paragraph|paragraf|bullet|poin|list|daftar|format|struktur)\b/i.test(p),
grouping: (p) => {
const hits = [/urgent|mendesak/i, /today|hari ini/i, /(can wait|wait|later|nanti|bisa nanti)/i]
.filter(r => r.test(p)).length;
return hits >= 2;
},
fields: (p) => /\b(sender|from|pengirim|dari)\b/i.test(p) && /\b(summary|ringkas|summar)\b/i.test(p) && /\b(action|aksi|tindakan|langkah)\b/i.test(p),
concise: (p) => /\b(concise|brief|short|no fluff|no pleasantries|no filler|singkat|padat|tanpa basa[- ]?basi|jangan basa|langsung)\b/i.test(p),
examples: (p) => /\b(example|for example|e\.g\.|sample|contoh|misalnya|seperti ini)\b/i.test(p) || p.includes('```') || /^\s*[-*•]\s/m.test(p),
// code-reviewer (tone + role reused)
order: (p) => {
const r = /\b(bug|kesalahan)\b/i.test(p);
const s = /\b(style|gaya|format|readability|keterbacaan)\b/i.test(p);
const i = /\b(improv|suggest|perbaik|saran|rekomendasi)\b/i.test(p);
return r && s && i;
},
limit: (p) => /\b(max|maximum|maks|maksimum|up to|at most|tidak lebih|no more|≤|<=)\s*\d|\b\d+\s*(bullet|poin|item|point)/i.test(p),
format: (p) => /\b(markdown|md|bullet|poin|heading|judul|code block|blok kode)\b/i.test(p)
};
// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------
function PromptEngineerSim({ onClose, lang }) {
const MISSIONS = lang === 'id' ? PE_MISSIONS_ID : PE_MISSIONS_EN;
const [missionIdx, setMissionIdx] = useStateS(0);
const [prompt, setPrompt] = useStateS('');
const [result, setResult] = useStateS(null); // { aiOutput, scores, total }
const [loading, setLoading] = useStateS(false);
const [error, setError] = useStateS(null);
const mission = MISSIONS[missionIdx];
useEffectS(() => {
const onKey = (e) => { if (e.key === 'Escape') onClose(); };
document.addEventListener('keydown', onKey);
document.body.style.overflow = 'hidden';
return () => {
document.removeEventListener('keydown', onKey);
document.body.style.overflow = '';
};
}, []);
// Reset per-mission state
useEffectS(() => {
setPrompt('');
setResult(null);
setError(null);
}, [missionIdx]);
const T = {
en: {
title: "AI / Prompt Engineer — live simulation",
subtitle: "Brief from a real-ish client. Write a prompt. See if your AI actually does the job.",
mission: "Mission",
client: "Client",
brief: "The brief",
testInput: "User will send this to your AI",
yourPrompt: "Your system prompt",
promptPh: "You are an assistant for...\n\nWhen the user asks about...\n\nAlways...\nNever...\n",
submit: "Run the AI",
running: "Running AI...",
rubric: "What we're checking",
result: "Result",
aiSays: "What the AI replied",
score: "Score",
met: "met",
missed: "missed",
tryAgain: "Edit prompt & retry",
next: "Next mission →",
prev: "← Previous",
tips: "Tips",
tip1: "Be specific: tell the AI its role, its tone, and its limits.",
tip2: "Tell it what NOT to do — AIs love filling silence with hallucinations.",
tip3: "Show examples of good output — AIs imitate better than they obey.",
hint: "Hint",
errFallback: "(AI call failed — scoring on your prompt structure only.)"
},
id: {
title: "AI / Prompt Engineer — simulasi langsung",
subtitle: "Brief dari klien realistis. Tulis prompt. Lihat apakah AI-mu benar-benar kerjain tugasnya.",
mission: "Misi",
client: "Klien",
brief: "Briefnya",
testInput: "User akan kirim ini ke AI-mu",
yourPrompt: "Prompt sistem-mu",
promptPh: "Kamu adalah asisten untuk...\n\nSaat user tanya tentang...\n\nSelalu...\nJangan pernah...\n",
submit: "Jalankan AI",
running: "AI sedang berpikir...",
rubric: "Yang kami cek",
result: "Hasil",
aiSays: "Balasan AI",
score: "Skor",
met: "tercapai",
missed: "terlewat",
tryAgain: "Edit prompt & coba lagi",
next: "Misi berikutnya →",
prev: "← Sebelumnya",
tips: "Tips",
tip1: "Spesifik: kasih tahu AI peran, nada, dan batasannya.",
tip2: "Kasih tahu apa yang JANGAN dilakukan — AI suka ngisi kesunyian dengan halusinasi.",
tip3: "Kasih contoh output bagus — AI meniru lebih baik daripada menurut.",
hint: "Petunjuk",
errFallback: "(AI gagal dipanggil — skor cuma dari struktur prompt-mu.)"
}
}[lang === 'id' ? 'id' : 'en'];
const runAI = async () => {
if (!prompt.trim()) return;
setLoading(true);
setError(null);
setResult(null);
let aiOutput = null;
try {
if (window.claude && typeof window.claude.complete === 'function') {
const full = `${prompt}\n\n---\nUser message:\n${mission.testInput}`;
aiOutput = await window.claude.complete(full);
} else {
setError(T.errFallback);
}
} catch (err) {
console.warn('claude.complete failed', err);
setError(T.errFallback);
}
// Score
const scores = mission.criteria.map(c => ({
...c,
passed: !!PE_MATCHERS[c.key] && PE_MATCHERS[c.key](prompt)
}));
const total = scores.filter(s => s.passed).length;
setResult({ aiOutput: aiOutput || '—', scores, total });
setLoading(false);
};
const percent = result ? Math.round((result.total / mission.criteria.length) * 100) : 0;
const verdict = (pct) => {
if (pct >= 100) return lang === 'id' ? "🏆 Sempurna — prompt ini siap produksi." : "🏆 Perfect — this prompt is production-ready.";
if (pct >= 80) return lang === 'id' ? "🎯 Hampir sempurna — poles sedikit lagi." : "🎯 Nearly there — polish one or two things.";
if (pct >= 60) return lang === 'id' ? "👍 Fondasi bagus — ada celah yang bisa diperbaiki." : "👍 Solid foundation — a few gaps to close.";
if (pct >= 40) return lang === 'id' ? "🔧 Jalan bagus, baca lagi briefnya." : "🔧 On the right track — re-read the brief.";
return lang === 'id' ? "📝 Mulai dari dasar: peran, nada, batasan, format." : "📝 Start from the basics: role, tone, limits, format.";
};
return (
<div className="sim-overlay" onClick={onClose}>
<div className="sim-sheet" onClick={(e) => e.stopPropagation()}>
<button className="detail-close" onClick={onClose} aria-label="Close">✕</button>
<div className="sim-header">
<div className="mono-label">🤖 SIMULATION</div>
<h1 className="sim-title">{T.title}</h1>
<p className="sim-subtitle">{T.subtitle}</p>
</div>
<div className="sim-missions">
{MISSIONS.map((m, i) => (
<button key={m.id}
className={`sim-mission-tab ${i === missionIdx ? 'active' : ''}`}
onClick={() => setMissionIdx(i)}>
<span className="sim-mission-num">{String(i+1).padStart(2,'0')}</span>
<span>{m.title}</span>
</button>
))}
</div>
<div className="sim-body">
<section className="sim-brief">
<div className="mono-label">{T.client}</div>
<div className="sim-client">{mission.client}</div>
<div className="mono-label mt">{T.brief}</div>
<p className="sim-brief-text">{mission.brief}</p>
<div className="mono-label mt">{T.testInput}</div>
<pre className="sim-test-input">{mission.testInput}</pre>
<div className="mono-label mt">{T.rubric}</div>
<ul className="sim-criteria-list">
{mission.criteria.map(c => {
const passed = result ? result.scores.find(s => s.key === c.key)?.passed : null;
return (
<li key={c.key} className={`sim-criterion ${passed === true ? 'pass' : passed === false ? 'fail' : ''}`}>
<span className="sim-criterion-mark">
{passed === true ? '✓' : passed === false ? '✕' : '○'}
</span>
<span>
{c.label}
{result && !passed && <span className="sim-hint"> · {T.hint}: {c.hint}</span>}
</span>
</li>
);
})}
</ul>
<div className="sim-tips">
<div className="mono-label">{T.tips}</div>
<ol>
<li>{T.tip1}</li>
<li>{T.tip2}</li>
<li>{T.tip3}</li>
</ol>
</div>
</section>
<section className="sim-work">
<div className="mono-label">{T.yourPrompt}</div>
<textarea className="sim-prompt" rows="10"
placeholder={T.promptPh}
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
spellCheck={false} />
<div className="sim-prompt-meta">
<span className="mono-label muted">{prompt.length} chars · {prompt.trim().split(/\s+/).filter(Boolean).length} words</span>
<button className="btn-primary" onClick={runAI} disabled={loading || !prompt.trim()}>
{loading ? '⏳ ' + T.running : '▶ ' + T.submit}
</button>
</div>
{result && (
<div className="sim-result">
<div className="sim-score">
<div className="sim-score-num">{percent}%</div>
<div className="sim-score-bar">
<div className="sim-score-fill" style={{ width: `${percent}%` }} />
</div>
<div className="sim-score-text">
{result.total} / {mission.criteria.length} {T.met} · {verdict(percent)}
</div>
</div>
<div className="mono-label mt">{T.aiSays}</div>
<div className="sim-ai-reply">{result.aiOutput}</div>
{error && <div className="sim-error">{error}</div>}
<div className="sim-nav">
<button className="btn-secondary"
onClick={() => setMissionIdx((missionIdx - 1 + MISSIONS.length) % MISSIONS.length)}>
{T.prev}
</button>
<button className="btn-secondary" onClick={() => setResult(null)}>{T.tryAgain}</button>
<button className="btn-primary"
onClick={() => setMissionIdx((missionIdx + 1) % MISSIONS.length)}>
{T.next}
</button>
</div>
</div>
)}
</section>
</div>
</div>
</div>
);
}
Object.assign(window, { PromptEngineerSim });

// --- App component + render ---
function App() {
const [tweaks, setTweaks] = useState(window.TWEAK_DEFAULTS);
const [tweaksVisible, setTweaksVisible] = useState(false);
const safeGet = (k, fb) => { try { return localStorage.getItem(k) || fb; } catch (_) { return fb; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
const [lang, setLang] = useState(() => safeGet('itpaths_lang', 'en'));
useEffect(() => {
safeSet('itpaths_lang', lang);
window.applyGlossary(lang);
document.documentElement.lang = lang;
}, [lang]);
// Edit-mode protocol — register FIRST, then announce
useEffect(() => {
const onMsg = (e) => {
if (!e.data || typeof e.data !== 'object') return;
if (e.data.type === '__activate_edit_mode') setTweaksVisible(true);
if (e.data.type === '__deactivate_edit_mode') setTweaksVisible(false);
};
window.addEventListener('message', onMsg);
window.parent.postMessage({ type: '__edit_mode_available' }, '*');
return () => window.removeEventListener('message', onMsg);
}, []);
// Apply theme
useEffect(() => {
const theme = window.THEMES[tweaks.theme] || window.THEMES.dark;
const root = document.documentElement;
root.style.setProperty('--bg', theme.bg);
root.style.setProperty('--ink', theme.ink);
root.style.setProperty('--muted', theme.muted);
root.style.setProperty('--cream', theme.cream);
root.style.setProperty('--card', theme.card);
root.style.setProperty('--line', theme.line);
root.style.setProperty('--shadow', theme.shadow);
root.style.setProperty('--serif', theme.serif);
root.style.setProperty('--sans', theme.sans);
root.style.setProperty('--mono', theme.mono);
const chroma = tweaks.theme === 'dark' ? 0.22 : 0.15;
const l = tweaks.theme === 'dark' ? 0.78 : 0.68;
root.style.setProperty('--accent', `oklch(${l} ${chroma} ${tweaks.accentHue})`);
root.style.setProperty('--font-scale', tweaks.fontScale);
}, [tweaks]);
// ⌘K / Ctrl+K to focus search
useEffect(() => {
const onKey = (e) => {
if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
e.preventDefault();
const input = document.querySelector('.search-input');
if (input) input.focus();
}
};
document.addEventListener('keydown', onKey);
return () => document.removeEventListener('keydown', onKey);
}, []);
const [filters, setFilters] = useState({
category: 'All', earning: 'all', difficulty: 5, math: 'any'
});
const [openPath, setOpenPath] = useState(null);
const [searchQuery, setSearchQuery] = useState('');
const [simPath, setSimPath] = useState(null);
const [quizOpen, setQuizOpen] = useState(false);
const [quizResults, setQuizResults] = useState(null);
const visible = useMemo(() => {
const q = searchQuery.toLowerCase().trim();
return window.PATHS.filter(p => {
if (filters.category !== 'All' && p.category !== filters.category) return false;
if (filters.earning !== 'all' && !p.earningStyles.includes(filters.earning)) return false;
if (p.difficulty > filters.difficulty) return false;
if (filters.math === 'light' && p.mathHeavy) return false;
if (filters.math === 'heavy' && !p.mathHeavy) return false;
if (q && !(
p.name.toLowerCase().includes(q) ||
(p.tagline || '').toLowerCase().includes(q) ||
p.category.toLowerCase().includes(q) ||
(p.keywords || []).some(kw => kw.toLowerCase().includes(q))
)) return false;
return true;
});
}, [filters, searchQuery]);
const openFromResults = (p) => { setQuizResults(null); setOpenPath(p); };
const t = window.T(lang);
const N = window.PATHS.length;
return (
<>
<header className="site-header">
<div className="site-logo">IT Paths<span className="dot">.</span>
</div>
      <nav className="header-nav">
        <span className="mono-label" style={{minWidth: '10ch', textAlign: 'right'}}>{N} paths</span>
        <div className="lang-switch">
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => setLang('id')}>ID</button>
        </div>
        <button className="btn-secondary" onClick={() => setQuizOpen(true)}>{t.take_quiz}</button>
      </nav>
</header>
<section className="hero">
<div>
<div className="hero-eyebrow mono-label">{t.hero_eyebrow}</div>
<h1 className="hero-title">
{t.hero_title_a} <em>{t.hero_title_b}</em><br/>
<span className="accent">{t.hero_title_c}</span> {t.hero_title_d}
</h1>
<p className="hero-lede">{N} IT careers explained in plain words — no degree required.</p>
<div className="hero-actions">
<button className="btn-primary" onClick={() => setQuizOpen(true)}>{t.find_my_path} →</button>
<button className="btn-secondary" onClick={() => document.getElementById('paths').scrollIntoView({behavior:'smooth', block:'start'})}>{t.browse_all} {N}</button>
</div>
</div>
<aside className="hero-side">
<div className="hero-stat">{N}</div>
<div className="hero-stat-label">paths</div>
<div className="hero-stat">3</div>
<div className="hero-stat-label">ways to earn</div>
</aside>
</section>
<div className="section-intro" id="paths">
<div className="mono-label">{t.browse}</div>
<h2 className="section-intro-title">{t.section_title}</h2>
<p className="section-intro-note">{t.section_note}</p>
</div>
<FilterBar filters={filters} setFilters={setFilters} total={N} visible={visible.length} lang={lang} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
<main className="paths-grid">
{visible.map(p =>
<PathCard key={p.id} path={p} onOpen={setOpenPath} lang={lang}/>)}
{visible.length === 0 && (
<div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--muted)'}}>
<div style={{fontFamily: 'var(--serif)', fontSize: 32, marginBottom: 8}}>{t.no_match}</div>
<button className="btn-secondary" onClick={() => setFilters({category: 'All', earning: 'all', difficulty: 5, math: 'any'})}>{t.reset}</button>
</div>
)}
</main>
<footer className="site-footer">
<div>
<div className="footer-wordmark">IT Paths<span style={{color: 'var(--accent)'}}>.</span>
</div>
<div style={{marginTop: 6}}>{t.footer_tag}</div>
</div>
<div style={{textAlign: 'right'}}>
<div className="mono-label">{t.footer_salary}</div>
<div className="mono-label" style={{marginTop: 6}}>{t.footer_roadmaps}</div>
</div>
</footer>
{openPath && <PathDetail path={openPath} onClose={() => setOpenPath(null)} onSimulate={(p) => { setOpenPath(null); setSimPath(p); }} lang={lang}/>}
{simPath && simPath.id === 'promptai' && <PromptEngineerSim onClose={() => setSimPath(null)} lang={lang}/>}
{quizOpen && (
<Quiz lang={lang}
onClose={() => setQuizOpen(false)}
onDone={(res) => { setQuizOpen(false); setQuizResults(res); }}
/>
)}
{quizResults && (
<QuizResults lang={lang}
results={quizResults}
onOpen={openFromResults}
onRetake={() => { setQuizResults(null); setQuizOpen(true); }}
onClose={() => setQuizResults(null)}
/>
)}
<TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} lang={lang}/>
</>
);
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
