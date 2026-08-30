import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Goal from "./pages/Goal";
import Roadmaps from "./pages/Roadmaps";
import RoadmapDetail from "./pages/RoadmapDetail";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import "./styles.css";

export default function App(){
 return <AuthProvider><BrowserRouter><Routes>
  <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
    <Route path="/dashboard" element={<Dashboard/>}/><Route path="/goal" element={<Goal/>}/><Route path="/roadmaps" element={<Roadmaps/>}/><Route path="/roadmaps/:id" element={<RoadmapDetail/>}/><Route path="/assistant" element={<Assistant/>}/><Route path="/profile" element={<Profile/>}/>
  </Route>
 </Routes></BrowserRouter></AuthProvider>
}
