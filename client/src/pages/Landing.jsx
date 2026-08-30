import { Link } from "react-router-dom";
import { ArrowRight, Brain, Compass, Sparkles, TrendingUp } from "lucide-react";

export default function Landing() {
  return <div className="landing">
    <nav className="landing-nav"><div className="brand"><span className="brand-mark">L</span> LearnPath AI</div><Link className="btn ghost" to="/login">Sign in</Link></nav>
    <section className="hero">
      <div className="badge"><Sparkles size={15}/> AI-powered personalized learning</div>
      <h1>Stop guessing what to learn next.</h1>
      <p>LearnPath AI analyzes your goals, current skills, interests and progress to build a learning path that adapts to you.</p>
      <Link className="btn primary large" to="/register">Build my learning path <ArrowRight size={18}/></Link>
    </section>
    <section className="feature-grid">
      <Feature icon={Brain} title="Skill-gap analysis" text="Understand what you know, what you need, and why the next skill matters."/>
      <Feature icon={Compass} title="Personalized path" text="Get ordered topics, projects, prerequisites and milestones fitted to your schedule."/>
      <Feature icon={TrendingUp} title="Adaptive progress" text="Track progress and ask the AI assistant to adjust your plan when life changes."/>
    </section>
  </div>
}
function Feature({icon: Icon, title, text}) {
  return <div className="feature-card"><Icon size={24}/><h3>{title}</h3><p>{text}</p></div>
}
