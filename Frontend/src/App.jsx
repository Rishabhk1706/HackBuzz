import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Colleges from "./pages/College";
import TermsAndConditions from "./pages/TermsAndConditions";
import HelpCenter from "./pages/HelpCenter";
import Dashboard from "./pages/Dashboard";
import AllEvents from "./pages/AllEvents"
import Event from "./pages/Event";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import UpdateEvent from "./pages/UpdateEvent";
import AllProjects from "./pages/AllProjects";
import Project from "./pages/Project";
import UpdateProject from "./pages/UpdateProject";
import CreateProject from "./pages/CreateProject";
import AllTeam from "./pages/AllTeam";
import Team from "./pages/Team";
import CreateTeam from "./pages/CreateTeam";
import UpdateTeam from "./pages/UpdateTeam";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/events/:id" element={<Event />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/events/new" element={<CreateEvent />} />
        <Route path="/events/update" element={<UpdateEvent />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/projects/update" element={<UpdateProject />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/match-requests" element={<AllTeam />} />
        <Route path="/match-requests/:id" element={<Team />} />
        <Route path="/match-requests/new" element={<CreateTeam />} />
        <Route path="/match-requests/update" element={<UpdateTeam />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;