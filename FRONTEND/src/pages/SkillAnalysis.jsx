import "./SkillAnalysis.css";
import icon7 from "../assets/icon7.png";
import { useState, useEffect } from "react";
import API from "../api/api";
import { generateRoadmapAPI } from "../api/roadmap";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";
import { resetUserData } from "../utils/resetUserData.js";

function SkillAnalysis() {

  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");

  const [openProfile, setOpenProfile] = useState(false);

  const [knownSkills, setKnownSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const data = JSON.parse(
      localStorage.getItem(`analysis_${userId}`)
    );

    console.log(" Loaded Analysis:", data);

    if (data) {
      setKnownSkills(data.knownSkills || []);
      setMissingSkills(data.missingSkills || []);
      setRole(data.role || "");
    }
  }, []);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");

    const userId = localStorage.getItem("userId");
    await resetUserData(userId, API);

 let formData = new FormData();

if (file) formData.append("resume", file);
if (role) formData.append("role", role);

const res = await API.post("/analysis/analyze", formData);

await resetUserData(userId, API);

const data = res.data;

    const safeData = {
      role: data.role || role || "Frontend Developer",
      knownSkills: Array.isArray(data.knownSkills) ? data.knownSkills : [],
      missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
    };


    localStorage.setItem(`analysis_${userId}`, JSON.stringify(safeData));
    localStorage.setItem(`selectedRole_${userId}`, safeData.role);

    setKnownSkills(safeData.knownSkills);
    setMissingSkills(safeData.missingSkills);

    await generateRoadmapAPI({
      role: safeData.role,
      missingSkills: safeData.missingSkills,
    });

    navigate("/roadmap");

  } catch (err) {
    console.error(err);
    setError("Analysis failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="skillanalysis">

      <div className="topbar">
        <div className="upload">
          <h4>Provide Resume or Target Role</h4>
          <p>Get a detailed skill analysis and career insights</p>
        </div>
        <div className="profile" onClick={() => setOpenProfile(true)}>
  <i className="fa-solid fa-circle-user"></i>
</div>
      </div>

      <div className="maincontainer">

        {/* LEFT */}
        <div className="search">
          <h4>Upload Your Resume</h4>

          <div className="resume">
            <img src={icon7} alt="icon" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <p>PDF, DOCX OR TXT</p>
          </div>

          <p>Or</p>

          <div className="input">
            <input
              placeholder="Enter your Job Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Skills"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </div>

        {/* RIGHT */}
        <div className="extracted">

          <h4>Extracted Skills</h4>

          {/* Known Skills */}
          <div className="skills">
            <h4>Known Skills ({knownSkills.length})</h4>
            <div className="skills-container">
              {knownSkills.map((skill, i) => (
                <div key={i} className="skill-pill">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="skills">
            <h4>Missing Skills ({missingSkills.length})</h4>
            <div className="skills-container">
              {missingSkills.map((skill, i) => (
                <div key={i} className="skill-pill missing">
                  {skill}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
      <ProfileModal
  isOpen={openProfile}
  onClose={() => setOpenProfile(false)}
/>
    </div>
  );
}

export default SkillAnalysis;
