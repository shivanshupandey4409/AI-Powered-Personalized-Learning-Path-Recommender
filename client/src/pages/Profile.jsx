import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile(){
 const {user,setUser}=useAuth(); const [form,setForm]=useState({interests:[],currentSkills:[],objectives:[],experienceLevel:"Beginner",preferredLearningStyle:"Mixed"});
 useEffect(()=>{if(user?.profile)setForm({...form,...user.profile})},[user]);
 const csv=(v)=>Array.isArray(v)?v.join(", "):v||"";
 const save=async()=>{const data={...form,interests:csv(form.interests).split(",").map(x=>x.trim()).filter(Boolean),currentSkills:csv(form.currentSkills).split(",").map(x=>x.trim()).filter(Boolean),objectives:csv(form.objectives).split(",").map(x=>x.trim()).filter(Boolean)};const x=await api.put("/profile",data);setUser(x.data.user);alert("Profile saved.");};
 return <div className="page narrow"><div className="page-head"><div><span className="eyebrow">LEARNER PROFILE</span><h1>Your profile</h1><p>Better profile data means better recommendations.</p></div></div><div className="section-card form-grid"><label>Experience level<select value={form.experienceLevel} onChange={e=>setForm({...form,experienceLevel:e.target.value})}>{["Beginner","Intermediate","Advanced"].map(x=><option key={x}>{x}</option>)}</select></label><label>Learning style<select value={form.preferredLearningStyle} onChange={e=>setForm({...form,preferredLearningStyle:e.target.value})}>{["Mixed","Project-based","Visual","Reading","Video"].map(x=><option key={x}>{x}</option>)}</select></label><label>Interests<input value={csv(form.interests)} onChange={e=>setForm({...form,interests:e.target.value})} placeholder="web development, AI, data"/></label><label>Current skills<input value={csv(form.currentSkills)} onChange={e=>setForm({...form,currentSkills:e.target.value})} placeholder="HTML, CSS, JavaScript"/></label><label className="span-2">Objectives<textarea value={csv(form.objectives)} onChange={e=>setForm({...form,objectives:e.target.value})} placeholder="Get an internship, build portfolio projects"/></label><button className="btn primary span-2" onClick={save}>Save profile</button></div></div>
}
