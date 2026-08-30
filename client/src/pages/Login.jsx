import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({email:"", password:""});
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault(); setError("");
    try { await login(form.email, form.password); navigate("/dashboard"); }
    catch (e) { setError(e.response?.data?.message || "Login failed."); }
  }
  return <AuthPage title="Welcome back" subtitle="Continue your learning journey." onSubmit={submit} fields={form} setFields={setForm} error={error} button="Sign in" footer={<>New here? <Link to="/register">Create an account</Link></>}/>;
}

export function AuthPage({title, subtitle, onSubmit, fields, setFields, error, button, footer, register=false}) {
  return <div className="auth-page"><div className="auth-card">
    <div className="brand">LearnPath AI</div><h1>{title}</h1><p className="muted">{subtitle}</p>
    <form onSubmit={onSubmit}>
      {register && <input required placeholder="Full name" value={fields.name} onChange={e=>setFields({...fields,name:e.target.value})}/>}
      <input required type="email" placeholder="Email" value={fields.email} onChange={e=>setFields({...fields,email:e.target.value})}/>
      <input required minLength="6" type="password" placeholder="Password (6+ characters)" value={fields.password} onChange={e=>setFields({...fields,password:e.target.value})}/>
      {error && <div className="error">{error}</div>}
      <button className="btn primary full">{button}</button>
    </form>
    <p className="auth-footer">{footer}</p>
  </div></div>
}
