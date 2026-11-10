import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile"; // <-- Naya Student Profile
import AlumniProfile from "./pages/AlumniProfile";   // <-- Naya Alumni Profile

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Post-Login Dynamic Role Profiles */}
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/alumni/profile" element={<AlumniProfile />} />
      </Routes>
    </BrowserRouter>
  );
}