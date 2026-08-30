import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import api from "../services/api";

export default function Assistant(){
 const [message,setMessage]=useState(""); const [messages,setMessages]=useState([{role:"assistant",text:"Hi! Ask me what to study today, why a topic was recommended, or how to handle a difficult concept."}]); const [loading,setLoading]=useState(false);
 async function send(e){e?.preventDefault(); if(!message.trim())return; const text=message;setMessages(m=>[...m,{role:"user",text}]);setMessage("");setLoading(true);try{const x=await api.post("/ai/chat",{message:text});setMessages(m=>[...m,{role:"assistant",text:x.data.reply}]);}catch(e){setMessages(m=>[...m,{role:"assistant",text:e.response?.data?.message||"AI request failed."}]);}finally{setLoading(false)}}
 return <div className="page"><div className="page-head"><div><span className="eyebrow">LEARNING ASSISTANT</span><h1>Ask LearnPath AI</h1><p>Your roadmap-aware study companion.</p></div></div><div className="chat-card"><div className="chat-messages">{messages.map((m,i)=><div key={i} className={`bubble ${m.role}`}>{m.role==="assistant"&&<Sparkles size={16}/>}<div>{m.text}</div></div>)}{loading&&<div className="bubble assistant">Thinking…</div>}</div><form className="chat-form" onSubmit={send}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="What should I study today?"/><button className="btn primary"><Send size={17}/></button></form></div></div>
}
