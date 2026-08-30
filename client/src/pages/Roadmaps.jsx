import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../services/api";

export default function Roadmaps(){
 const [items,setItems]=useState([]);
 useEffect(()=>{api.get("/roadmaps").then(r=>setItems(r.data.roadmaps))},[]);
 return <div className="page"><div className="page-head"><div><span className="eyebrow">YOUR PATHS</span><h1>My learning paths</h1></div><Link className="btn primary" to="/goal">New path</Link></div>
 <div className="section-card">{items.length?items.map(r=><Link className="roadmap-row" key={r._id} to={`/roadmaps/${r._id}`}><div><strong>{r.title}</strong><span>{r.description}</span></div><ArrowRight/></Link>):<div className="empty">No paths yet.</div>}</div></div>
}
