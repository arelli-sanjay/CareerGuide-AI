import "./Dashboard.css";
import ProfileModal from "../components/ProfileModal";
import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";
import icon4 from "../assets/icon4.png";
import icon5 from "../assets/icon5.png";
import icon6 from "../assets/icon6.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";

function Dashboard() {

  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [displayName, setDisplayName] = useState("User");

  const [missingSkills, setMissingSkills] = useState([]);
  const [knownSkills, setKnownSkills] = useState([]);
  const [completedWeeks, setCompletedWeeks] = useState(0);
  const [totalWeeks, setTotalWeeks] = useState(0);
  const [user, setUser] = useState(null);

  const loadUserName = () => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setDisplayName(userData.name || "User");
  };

 useEffect(() => {

  const loadAll = async () => {
    try {
      const res = await API.get("/user/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      setDisplayName(res.data.name || "User");

      const userId = localStorage.getItem("userId");

      const analysis = JSON.parse(localStorage.getItem(`analysis_${userId}`)) || {};
      setKnownSkills(analysis.knownSkills || []);
      setMissingSkills(analysis.missingSkills || []);

      const roadmap = JSON.parse(localStorage.getItem(`roadmap_${userId}`)) || [];
      setTotalWeeks(roadmap.length);

      let completed = 0;
      roadmap.forEach((week) => {
        if (localStorage.getItem(`week-${userId}-${week.weekNumber}-completed`) === "true") {
          completed++;
        }
      });

      setCompletedWeeks(completed);

    } catch (err) {
      console.error(err);
    }
  };

  loadAll();

}, []);

  const handleViewDetails = () => {
    navigate("/analysis", {
      state: { knownSkills, missingSkills },
    });
  };

  return (
    <div className="dashboard">

      <div className="topbar">
        <div className="wish">
          <h4>Welcome back, {displayName} !</h4>
          <p>You're making good progress.</p>
        </div>

        <div className="profile" onClick={() => setOpenProfile(true)}>
          <i className="fa-solid fa-circle-user"></i>
        </div>
      </div>

      <div className="cards-1">

        <div className="custom-card">
          <div className="card-image">
            <img src={icon1} alt="img" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Extracted Skills</h3>
            <p className="card-text-1">
              {knownSkills.length + missingSkills.length} <br /> Skills
            </p>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-image">
            <img src={icon2} alt="img" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Missing Skills</h3>
            <p className="card-text-2">
              {missingSkills.length} <br /> Skills
            </p>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-image">
            <img src={icon3} alt="img" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Weekly Goals</h3>
            <p className="card-text-3">
              {completedWeeks} of {totalWeeks} <br /> Weeks
            </p>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-image">
            <img src={icon4} alt="img" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Project Day</h3>
            <p className="card-text-4">
              {user?.projectCompleted ? "Unlocked" : "Locked"}
            </p>
          </div>
        </div>

      </div>

      <div className="cards-2">

        <div className="custom-card">
          <h3 className="card-title">Extracted Skills</h3>
          <div className="card-image">
            <img src={icon5} alt="img" />
          </div>
          <div className="card-body">
            <button onClick={handleViewDetails}>View Details</button>
          </div>
        </div>

        <div className="custom-card">
          <h3 className="card-title">Skills Gap for Job</h3>
          <div className="card-image">
            <img src={icon6} alt="img" />
          </div>
          <div className="card-body">
            <button onClick={handleViewDetails}>View Details</button>
          </div>
        </div>

      </div>

      {/*IMPORTANT FIX HERE */}
      <ProfileModal
        isOpen={openProfile}
        onClose={() => {
          setOpenProfile(false);
          loadUserName(); 
        }}
      />

    </div>
  );
}

export default Dashboard;