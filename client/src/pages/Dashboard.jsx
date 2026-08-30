import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, Target } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [roadmaps,setRoadmaps]=useState([]);
  const [goals,setGoals]=useState([]);
  useEffect(()=>{ Promise.all([api.get("/roadmaps"),api.get("/goals")]).then(([r,g])=>{setRoadmaps(r.data.roadmaps);setGoals(g.data.goals)}); },[]);
  const stats=useMemo(()=>{
    let total=0,done=0;
    for(const r of roadmaps) for(const p of r.phases) for(const t of p.topics) for(const task of t.tasks){total++; if(task.status==="Completed") done++;}
    return {total,done,progress:total?Math.round(done/total*100):0};
  },[roadmaps]);
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">YOUR LEARNING COMMAND CENTER</span><h1>Dashboard</h1><p>See where you are and what to do next.</p></div><Link className="btn primary" to="/goal">Create new path</Link></div>
    <div className="stat-grid">
      <Stat icon={Target} label="Active paths" value={roadmaps.length}/>
      <Stat icon={CheckCircle2} label="Completed tasks" value={stats.done}/>
      <Stat icon={Clock3} label="Tasks remaining" value={Math.max(0,stats.total-stats.done)}/>
      <Stat icon={ArrowRight} label="Overall progress" value={`${stats.progress}%`}/>
    </div>
    <div className="section-card"><h2>Recent learning paths</h2>{roadmaps.length===0?<Empty/>:roadmaps.slice(0,5).map(r=><Link className="roadmap-row" to={`/roadmaps/${r._id}`} key={r._id}><div><strong>{r.title}</strong><span>{r.description}</span></div><ArrowRight/></Link>)}</div>
    <div className="section-card"><h2>Goals</h2>{goals.length===0?<Empty text="Create your first goal to generate a path."/>:goals.slice(0,4).map(g=><div className="roadmap-row" key={g._id}><div><strong>{g.title}</strong><span>{g.currentLevel} → {g.targetLevel || "Target"}</span></div></div>)}</div>
  </div>
}
function Stat({icon:Icon,label,value}){return <div className="stat"><Icon size={19}/><span>{label}</span><strong>{value}</strong></div>}
function Empty({text="No learning paths yet."}){return <div className="empty">{text}</div>}
