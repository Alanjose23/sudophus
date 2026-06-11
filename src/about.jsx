import "./App.css"
import { NotebookPen, Rocket, Quote } from "lucide-react"
import sudoLogo from "./assets/sudo.jpg"

function About() {
  return (
    <div className="about-page">
      <div className="about-container">

        <div className="about-hero">
          <img src={sudoLogo} alt="Sudophus" className="about-img" />
          <h1 className="about-title">Sudophus</h1>
          <p className="about-tagline">A journal for the perpetual climb.</p>
        </div>

        <section className="about-section about-section--1">
          <div className="about-section-label">The Myth</div>
          <h2>Named after Sisyphus</h2>
          <p>
            Sisyphus was condemned to roll a boulder up a hill for eternity —
            only to watch it tumble back down each time he neared the top.
            Software development feels the same way. Languages evolve. Frameworks
            are deprecated. Every few years you relearn what you thought you already knew.
          </p>
          <p>
            We named this project after him not as a warning, but as a reframe.
            The climb is the point. The difference is that Sisyphus left no record.
            You will.
          </p>
        </section>

        <section className="about-section about-section--2">
          <div className="about-section-label">The Mission</div>
          <h2>Document the comeback in real time</h2>
          <p>
            Sudophus is a living document of your craft. Not a résumé, not a
            portfolio — a raw, honest account of the climb. The bugs that stumped
            you for three days. The concept that finally clicked at 11pm. The day
            everything compiled and you didn't know why.
          </p>
          <p>
            Progress is invisible when you are inside it. Writing makes it visible.
            A journal entry from six months ago is proof that the person you are
            today is not the person you were then.
          </p>
        </section>

        <section className="about-section about-section--3">
          <div className="about-section-label">The Philosophy</div>
          <h2>Curiosity is the craft</h2>
          <p>
            Most developers measure growth in shipped features or merged PRs.
            Sudophus measures it in documented moments — the commit that took
            three days, the debugging session that revealed a deeper pattern,
            the question you asked that you wouldn't have even known to ask
            six months earlier.
          </p>
          <p>
            This is not productivity software. It is accountability to your own
            curiosity. The journal is the evidence that you showed up.
          </p>
        </section>

        <section className="about-section about-section--4">
          <div className="about-section-label">What it does</div>
          <h2>A toolkit for the journey</h2>
          <div className="about-features">
            <div className="about-feature">
              <span className="about-feature-icon"><NotebookPen size={20} strokeWidth={1.5} aria-hidden="true" /></span>
              <div>
                <strong>Journal</strong>
                <p>Write freeform entries tied to your account. Every entry is timestamped and persisted — your full history is always there when you return.</p>
              </div>
            </div>
            <div className="about-feature">
              <span className="about-feature-icon"><Rocket size={20} strokeWidth={1.5} aria-hidden="true" /></span>
              <div>
                <strong>Projects</strong>
                <p>Attach the things you build to the process of building them. Document not just what shipped, but what the journey to ship it looked like.</p>
              </div>
            </div>
            <div className="about-feature">
              <span className="about-feature-icon"><Quote size={20} strokeWidth={1.5} aria-hidden="true" /></span>
              <div>
                <strong>Quotes</strong>
                <p>Curated words from writers, scientists, and thinkers who understood that the work is never finished — and that is exactly the point.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="about-footer">
          <p>Built with React &amp; Firebase &nbsp;·&nbsp; Inspired by the myth of Sisyphus</p>
          <p className="about-footer-sub">
            "One must imagine Sisyphus happy." — Albert Camus
          </p>
        </footer>

      </div>
    </div>
  )
}

export default About