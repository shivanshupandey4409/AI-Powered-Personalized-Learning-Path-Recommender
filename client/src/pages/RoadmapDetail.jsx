import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import api from "../services/api";

export default function RoadmapDetail(){
 const {id}=useParams(); const [r,setR]=useState(null); const [open,setOpen]=useState({}); const [analysis,setAnalysis]=useState("");
 useEffect(()=>{api.get(`/roadmaps/${id}`).then(x=>setR(x.data.roadmap))},[id]);
 const all=useMemo(()=>r?.phases.flatMap(p=>p.topics.flatMap(t=>t.tasks))||[],[r]);
 const progress=all.length?Math.round(all.filter(t=>t.status==="Completed").length/all.length*100):0;
 async function toggle(task){
   const status=task.status==="Completed"?"Not Started":"Completed";
   const {data}=await api.patch(`/tasks/${task._id}`,{status});setR(data.roadmap);
 }
 if(!r)return <div className="center-page">Loading roadmap…</div>;
 return <div className="page"><div className="roadmap-hero"><span className="eyebrow">PERSONALIZED LEARNING PATH</span><h1>{r.title}</h1><p>{r.description}</p><div className="progress-line"><div style={{width:`${progress}%`}}/></div><span>{progress}% complete · {r.totalDays} days</span></div>
 <div className="content-two"><div>
 {r.skillGaps?.length>0&&<div className="section-card"><h2>Skill gaps</h2>{r.skillGaps.map((g,i)=><div className="gap" key={i}><strong>{g.skill}</strong><span>{g.currentLevel} → {g.targetLevel}</span><p>{g.reason}</p></div>)}</div>}
 {r.phases.map((p,pi)=><div className="phase" key={p._id}><button className="phase-head" onClick={()=>setOpen({...open,[p._id]:!open[p._id]})}>{open[p._id]?<ChevronDown/>:<ChevronRight/>}<div><strong>Phase {p.order}: {p.title}</strong><span>{p.description} · {p.durationDays} days</span></div></button>{open[p._id]&&<div className="phase-body">{p.topics.map(t=><div className="topic" key={t._id}><h3>{t.title}</h3><p>{t.description}</p>{t.tasks.map(task=><button className="task" key={task._id} onClick={()=>toggle(task)}>{task.status==="Completed"?<CheckCircle2/>:<Circle/>}<span><strong>{task.title}</strong><small>{task.description} · {task.estimatedHours}h · {task.priority}</small></span></button>)}</div>)}</div>}</div>)}
 </div><aside><div className="section-card"><h2>AI progress review</h2><button className="btn secondary full" onClick={async()=>{const x=await api.post("/ai/analyze-progress",{roadmapId:id});setAnalysis(x.data.analysis)}}>Analyze my progress</button>{analysis&&<p className="ai-text">{analysis}</p>}</div><div className="section-card"><h2>Milestones</h2>{r.milestones?.map(m=><div className="milestone" key={m._id}><strong>Day {m.day}</strong><span>{m.title}</span><small>{m.description}</small></div>)}</div></aside></div></div>
}
