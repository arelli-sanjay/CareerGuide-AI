import './App.css';
import { MyContext } from "./MyContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import SkillAnalysis from "./pages/SkillAnalysis.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import ProjectPlanner from './pages/ProjectPlanner.jsx';
import ProjectRoute from './pages/ProjectRoute.jsx';
import RolesSuggest from './pages/RolesSuggest.jsx';
import DailyPlan from './pages/DailyPlan.jsx';
import CodeReview from './pages/CodeReview.jsx';

// Auth
import Login from './components/Login.jsx';
import Signup from './components/SignUp.jsx';

function App() {
  const providerValues = {};

  return (
    <Router>
      <div className="main">
        <MyContext.Provider value={providerValues}>

          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SkillAnalysis />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Roadmap />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectPlanner />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/project-route"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectRoute />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RolesSuggest />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/daily-plan/:weekId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DailyPlan />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/code-review"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CodeReview />
                  </Layout>
                </ProtectedRoute>
              }
            />

          </Routes>

        </MyContext.Provider>
      </div>
    </Router>
  );
}

export default App;