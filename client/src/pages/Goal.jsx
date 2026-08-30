import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Goal() {
  const nav=useNavigate();
  const [form,setForm]=useState({title:"",description:"",currentLevel:"Beginner",targetLevel:"Job-ready",durationDays:60,dailyHours:2,preferredLearningStyle:"Mixed",objective:""});
  const [loading,setLoading]=useState(false), [error,setError]=useState("");
  const set=(k,v)=>setForm({...form,[k]:v});
  async function submit(e){
    e.preventDefault();setLoading(true);setError("");
    try{
      const {data}=await api.post("/goals",{...form,durationDays:Number(form.durationDays),dailyHours:Number(form.dailyHours)});
      const result=await api.post("/ai/generate-path",{goalId:data.goal._id});
      nav(`/roadmaps/${result.data.roadmap._id}`);
    }catch(e){setError(e.response?.data?.message||"Could not generate your path.");}
    finally{setLoading(false)}
  }
  return <div className="page narrow"><div className="page-head"><div><span className="eyebrow">PERSONALIZATION</span><h1>Build your learning path</h1><p>The AI uses these details to tailor your journey.</p></div></div>
    <form className="section-card form-grid" onSubmit={submit}>
      <label>Goal title<input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Become a Full Stack Developer"/></label>
      <label>Goal description<textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What do you want to achieve?"/></label>
      <label>Current skill level<select value={form.currentLevel} onChange={e=>set("currentLevel",e.target.value)}>{["Beginner","Intermediate","Advanced"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Target skill level<input value={form.targetLevel} onChange={e=>set("targetLevel",e.target.value)}/></label>
      <label>Duration (days)<input type="number" min="7" value={form.durationDays} onChange={e=>set("durationDays",e.target.value)}/></label>
      <label>Daily study hours<input type="number" min="0.5" step="0.5" value={form.dailyHours} onChange={e=>set("dailyHours",e.target.value)}/></label>
      <label>Learning style<select value={form.preferredLearningStyle} onChange={e=>set("preferredLearningStyle",e.target.value)}>{["Mixed","Project-based","Visual","Reading","Video"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Main objective<textarea value={form.objective} onChange={e=>set("objective",e.target.value)} placeholder="Build 2 portfolio projects and become interview-ready"/></label>
      {error&&<div className="error span-2">{error}</div>}
      <button disabled={loading} className="btn primary span-2">{loading?"AI is analyzing your profile…":"Generate personalized path"}</button>
    </form>
  </div>
}
