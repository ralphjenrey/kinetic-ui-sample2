import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@ralphjenrey/kinetic-ui/tokens.css';
import './styles.css';
import { profile, projects } from './content';
import MotionEffects from './MotionEffects';

const categories = ['All projects', 'Full stack', 'Frontend', 'Tools'];

function ProjectPreview({ kind, large = false }) {
  if (kind === 'workspace') return <div className={`project-art workspace-art ${large ? 'large' : ''}`} aria-hidden="true">
    <div className="mock-window">
      <aside className="mock-sidebar"><strong className="orbit-logo">orbit<span>.</span></strong><div className="mock-nav selected">Overview</div><div className="mock-nav">Projects</div><div className="mock-nav">My tasks</div><div className="mock-nav">Team</div><span className="mock-sidebar-bottom">Your workspace, in focus.</span></aside>
      <div className="mock-content"><div className="mock-topline"><span>Workspace / Overview</span><span className="mock-avatar">JD</span></div><h4>Make room for good work.</h4><p>Here’s what’s happening with your projects.</p><div className="mock-stats"><div><span>Active projects</span><strong>08</strong></div><div><span>Tasks completed</span><strong>24 <small>this week</small></strong></div></div><div className="mock-board-title">Your projects <span>View all</span></div><div className="mock-board">{['Website redesign', 'Design system', 'Mobile experience'].map((x, i) => <div className="mock-task" key={x}><span className="mock-tag">{['In progress', 'In review', 'Planning'][i]}</span><strong>{x}</strong><div className="task-lines"><i /><i /></div><div className="task-footer"><span>Engineering</span><span>{['6 / 10', '8 / 12', '2 / 8'][i]}</span></div></div>)}</div></div>
    </div><span className="art-caption">A clearer view of what’s next.</span>
  </div>;
  if (kind === 'analytics') return <div className="project-art analytics-art" aria-hidden="true"><div className="analytics-window"><div className="analytics-heading"><strong>pulse<span>.</span></strong><span>Overview</span><span>Last 30 days</span></div><div className="analytics-value"><span>Total activity</span><strong>24,892 <small>+18.6%</small></strong></div><svg viewBox="0 0 500 120" preserveAspectRatio="none"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7796ed" stopOpacity=".3"/><stop offset="1" stopColor="#7796ed" stopOpacity="0"/></linearGradient></defs><path d="M0 102 C20 102 24 70 45 78 S80 100 100 66 S130 85 150 58 S180 80 200 48 S230 62 250 42 S280 64 300 35 S330 50 350 25 S380 45 400 16 S440 35 465 12 L500 4 L500 120 L0 120Z" fill="url(#chart-fill)"/><path d="M0 102 C20 102 24 70 45 78 S80 100 100 66 S130 85 150 58 S180 80 200 48 S230 62 250 42 S280 64 300 35 S330 50 350 25 S380 45 400 16 S440 35 465 12 L500 4" fill="none" stroke="#5279e1" strokeWidth="3"/></svg><div className="chart-axis"><span>Jun 1</span><span>Jun 15</span><span>Jun 30</span></div></div></div>;
  return <div className="project-art code-art" aria-hidden="true"><div className="code-window"><div className="code-topline"><strong>snippet<span>.</span></strong><span>useLocalStorage.js</span><span>JavaScript</span></div><div className="code-body"><span className="code-comment">// A small hook. One less repeat.</span><br/><span className="code-purple">export function</span> <span className="code-blue">useLocalStorage</span>(key, initial) {'{'}<br/>&nbsp;&nbsp;<span className="code-purple">const</span> [value, setValue] = <span className="code-blue">useState</span>(() =&gt; {'{'}<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-purple">const</span> saved = localStorage.<span className="code-blue">getItem</span>(key);<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-purple">return</span> saved ? JSON.<span className="code-blue">parse</span>(saved) : initial;<br/>&nbsp;&nbsp;{'}'});<br/>&nbsp;&nbsp;<span className="code-purple">return</span> [value, setValue];<br/>{'}'}</div></div></div>;
}

function ProjectDialog({ project, close }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} className="project-dialog" aria-labelledby="dialog-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="dialog-inner"><div className="dialog-top"><span className="eyebrow">Sample project / {project.category}</span><button className="outline-button" onClick={close} autoFocus>Close</button></div><h2 id="dialog-title">{project.name}</h2><p className="dialog-subtitle">{project.subtitle}</p><ProjectPreview kind={project.preview}/><p>{project.overview}</p><h3>Engineering considerations</h3><ul className="decision-list">{project.decisions.map(d => <li key={d}>{d}</li>)}</ul><div className="tags">{project.stack.map(t => <span key={t}>{t}</span>)}</div><p className="sample-note">Illustrative concept, not a claim of completed client work.</p><button className="outline-button" onClick={close}>Back to projects</button></div></dialog>;
}

function App() {
  const [filter, setFilter] = useState('All projects');
  const [pendingFilter, setPendingFilter] = useState('All projects');
  const [swapping, setSwapping] = useState(false);
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('work');
  const timer = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setMenu(false); };
    const onPointer = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(e => observer.observe(e));
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); observer.disconnect(); };
  }, []);
  function changeFilter(next) {
    clearTimeout(timer.current);
    setPendingFilter(next);
    setSwapping(true);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => { setFilter(next); setSwapping(false); }, reduced ? 0 : 280);
  }
  const visible = projects.filter(p => filter === 'All projects' || p.type === filter);
  const links = <>{[['work', 'Work'], ['about', 'About'], ['approach', 'Approach']].map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setMenu(false)}>{label}</a>)}</>;
  return <><MotionEffects revision={filter} suspended={Boolean(selected)}/><a href="#main" className="skip-link">Skip to content</a><div className="site-wrap" id="top" inert={selected ? true : undefined}>
    <header className="header"><a className="identity" href="#top"><span className="identity-symbol" aria-hidden="true">{'{ }'}</span><span>{profile.name}<small>{profile.role}</small></span></a><nav className="desktop-nav" aria-label="Main">{links}</nav><a className="header-contact" href="#contact">Let’s talk</a><div className="mobile-menu" ref={menuRef}><button className="outline-button" aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>Menu</button>{menu && <nav id="mobile-nav" aria-label="Mobile">{links}<a href="#contact" onClick={() => setMenu(false)}>Let’s talk</a></nav>}</div></header>
    <main id="main"><section className="hero" aria-labelledby="hero-heading"><div className="hero-top"><span className="eyebrow">Independent thinking. Considered engineering.</span><span className="hero-index">Portfolio / 2026</span></div><div className="hero-layout"><div className="hero-copy"><h1 id="hero-heading">THOUGHTFUL CODE.<br/>USEFUL <em>software.</em></h1><p>{profile.intro}</p><div className="hero-actions"><a className="primary-button" href="#work">Explore my work</a><a className="text-button" href="#about">A little about me</a></div></div><div className="system-art" aria-label="An architectural sketch connecting an interface, application logic, and data"><div className="blueprint-label">From idea to implementation</div><div className="blueprint-canvas"><div className="architecture-node node-interface"><span>01 / Experience</span><strong>Interface</strong><div className="mini-interface"><i/><i/><i/></div></div><div className="architecture-node node-logic"><span>02 / Engineering</span><strong>Logic</strong><code>idea.build()</code></div><div className="architecture-node node-data"><span>03 / Foundation</span><strong>Data</strong><div className="data-stack"><i/><i/><i/></div></div><svg className="connectors" viewBox="0 0 400 330" fill="none" aria-hidden="true"><path d="M170 97H285V155M100 150V260H190" stroke="currentColor" strokeWidth="1" strokeDasharray="4 5"/><circle cx="285" cy="155" r="4" fill="currentColor"/><circle cx="190" cy="260" r="4" fill="currentColor"/></svg><span className="blueprint-plus plus-one" aria-hidden="true">+</span><span className="blueprint-plus plus-two" aria-hidden="true">+</span></div><div className="blueprint-footer"><span>Simple on the surface.</span><span>Solid underneath.</span></div></div></div><div className="hero-bottom"><span>Built with care, from the first commit.</span><a href="#work">Scroll to explore</a></div></section>
    <section className="work-section" id="work" aria-labelledby="work-heading"><div className="section-heading"><div><span className="eyebrow">Ideas made tangible</span><h2 id="work-heading">SELECTED WORK<span className="heading-period">.</span></h2></div><p>A few ways to turn a problem<br/>into something useful.</p></div><div className="work-toolbar"><div className="filters" aria-label="Filter projects">{categories.map(c => <button key={c} aria-pressed={pendingFilter === c} onClick={() => changeFilter(c)}>{c}{c === 'All projects' && <span className="filter-count">03</span>}</button>)}</div><span className="sample-label">Illustrative projects</span></div><div className={`project-grid ${filter !== 'All projects' ? 'filtered' : ''} ${swapping ? 'swapping' : ''}`} inert={swapping ? true : undefined}>{visible.map((p, i) => <article className={`project ${i === 0 && filter === 'All projects' ? 'featured' : ''}`} key={p.id}><button className="project-open" onClick={() => setSelected(p)} aria-label={`View ${p.name} sample project`}><ProjectPreview kind={p.preview} large={i === 0}/><div className="project-info"><div><span className="project-category">{p.category}</span><h3>{p.name}</h3></div><span className="project-view">View project</span></div></button><p className="project-description">{p.description}</p><div className="tags">{p.stack.map(t => <span key={t}>{t}</span>)}</div></article>)}</div><span className="sr-only" role="status">{visible.length} projects shown</span><p className="work-footnote">Sample concepts to demonstrate the portfolio layout. Real project stories go here.</p></section>
    <section className="about-section" id="about" aria-labelledby="about-heading"><div className="about-title"><span className="eyebrow">The person behind the code</span><h2 id="about-heading">CURIOUS BY NATURE.<br/>ENGINEER BY <em>choice.</em></h2></div><div className="about-copy"><p>{profile.about}</p><p>My approach is simple: ask good questions, make deliberate choices, and leave things a little better than I found them.</p><a className="text-button" href="#approach">How I work</a></div></section>
    <section className="approach-section" id="approach" aria-labelledby="approach-heading"><div className="section-heading"><div><span className="eyebrow">The way I work</span><h2 id="approach-heading">GOOD SOFTWARE IS<br/>A SERIES OF GOOD CHOICES.</h2></div></div><div className="approach-list">{[['01', 'Understand the problem', 'Start with the people using it. Ask what matters, question assumptions, and define what a useful outcome looks like.'], ['02', 'Build with intention', 'Choose the simplest architecture that fits. Make the interface clear, the code readable, and the important paths reliable.'], ['03', 'Refine the details', 'Test the edges, listen to feedback, and keep improving. The last few details often make the biggest difference.']].map(([n, title, text]) => <div className="approach-row" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="contact-section" id="contact" aria-labelledby="contact-heading"><div><span className="eyebrow">Have something in mind?</span><h2 id="contact-heading">LET’S MAKE<br/>SOMETHING <em>useful.</em></h2></div><div className="contact-copy"><p>Good things start with a conversation.<br/>About a project, an opportunity, or an interesting problem.</p>{profile.email ? <a className="primary-button" href={`mailto:${profile.email}`}>Send me an email</a> : <span className="contact-pending">Contact details coming soon</span>}<div className="social-links">{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>}</div></div></section></main>
    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>Thoughtfully built with React & Kinetic UI.</span><a href="#top">Back to top</a></footer></div>{selected && <ProjectDialog project={selected} close={() => setSelected(null)}/>}</>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
