import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthPage } from "./Login";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({name:"",email:"",password:""});
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault(); setError("");
    try { await register(form.name, form.email, form.password); navigate("/dashboard"); }
    catch (e) { setError(e.response?.data?.message || "Registration failed."); }
  }
  return <AuthPage title="Create your learning profile" subtitle="Tell LearnPath AI where you want to go." onSubmit={submit} fields={form} setFields={setForm} error={error} button="Create account" register footer={<>Already have an account? <Link to="/login">Sign in</Link></>}/>;
}
