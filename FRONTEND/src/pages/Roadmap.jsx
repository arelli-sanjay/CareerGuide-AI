import "./Roadmap.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import ProfileModal from "../components/ProfileModal";

function Roadmap() {

    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    // LOAD ANALYSIS (USER BASED)
    const storedAnalysis = JSON.parse(
        localStorage.getItem(`analysis_${userId}`)
    );

   useEffect(() => {

    if (!storedAnalysis) return;

    const savedRoadmap = localStorage.getItem(`roadmap_${userId}`);

    if (savedRoadmap) {
        console.log("Using cached roadmap");
        setRoadmap(JSON.parse(savedRoadmap));
        return; 
    }

    const fetchRoadmap = async () => {
        try {
            setLoading(true);

            const res = await API.post("/roadmap/generate", {
                role: storedAnalysis.role,
                missingSkills: storedAnalysis.missingSkills
            });

            const data = res.data.roadmap;

            setRoadmap(data);

            localStorage.setItem(
                `roadmap_${userId}`,
                JSON.stringify(data)
            );

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchRoadmap();

}, []);useEffect(() => {

    if (!storedAnalysis) return;

    const savedRoadmap = localStorage.getItem(`roadmap_${userId}`);

    if (savedRoadmap) {
        console.log(" Using cached roadmap");
        setRoadmap(JSON.parse(savedRoadmap));
        return; 
    }


    const fetchRoadmap = async () => {
        try {
            setLoading(true);

            const res = await API.post("/roadmap/generate", {
                role: storedAnalysis.role,
                missingSkills: storedAnalysis.missingSkills
            });

            const data = res.data.roadmap;

            setRoadmap(data);

            localStorage.setItem(
                `roadmap_${userId}`,
                JSON.stringify(data)
            );

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchRoadmap();

}, []);

useEffect(() => {
    if (roadmap.length > 0) {

        const userId = localStorage.getItem("userId");

        let completed = 0;

        roadmap.forEach((week) => {
            const isDone =
                localStorage.getItem(
                    `week-${userId}-${week.weekNumber}-completed`
                ) === "true";

            if (isDone) completed++;
        });

        console.log(" Completed:", completed, "/", roadmap.length);

        if (completed === roadmap.length) {

            console.log("Triggering roadmap complete API");

            const updateBackend = async () => {
                try {
                    await API.post("/user/roadmap/complete");
                    const res = await API.get("/user/me");
                    localStorage.setItem("user", JSON.stringify(res.data));

                    console.log(" User updated:", res.data);

                } catch (err) {
                    console.error(" API ERROR:", err.response?.data || err.message);
                }
            };

            updateBackend();
        }
    }
}, [roadmap]);

    return(
        <div className="roadmap">

            <div className="topbar">
                <div className="wish">
                    <h4>Your Learning Roadmap</h4>
                    <p>Follow a personalized weekly learning plan to close your skill gaps</p>
                </div>
                <div className="profile" onClick={() => setOpenProfile(true)}>
  <i className="fa-solid fa-circle-user"></i>
</div>
            </div>

            <div className="scroll">

                {loading && <p>Loading roadmap...</p>}

                {/* ROUTE TRACKER */}
                <div className="route">
                    {roadmap.map((week, index) => {

                        const isCompleted =
                            localStorage.getItem(
                                `week-${userId}-${week.weekNumber}-completed`
                            ) === "true";

                        return (
                            <div className="step" key={index}>
                                <div className={`circle ${isCompleted ? "active" : ""}`}>
                                    {isCompleted ? "✓" : ""}
                                </div>
                                <p>Week-{week.weekNumber}</p>
                            </div>
                        );
                    })}
                </div>

                {/* WEEKS */}
                <div className="weeks">
                    {roadmap.map((week, index) => {

                        const isCompleted =
                            localStorage.getItem(
                                `week-${userId}-${week.weekNumber}-completed`
                            ) === "true";

                        const isUnlocked =
                            index === 0 ||
                            localStorage.getItem(
                                `week-${userId}-${roadmap[index - 1]?.weekNumber}-completed`
                            ) === "true";

                        const totalTopics = week.topics?.length || 0;
                        const completedTopics = isCompleted ? totalTopics : 0;

                        return (
                            <div className="week" key={index}>
                                
                                <h4>Week-{week.weekNumber}</h4>

                                <div
                                    className={isCompleted ? "title" : "title2"}
                                    style={
                                        isCompleted
                                            ? {
                                                backgroundColor: "#65da80",
                                                color: "white",
                                                width: "100%"
                                              }
                                            : {}
                                    }
                                >
                                    <h3>{week.title}</h3>
                                </div>

                                <div className="topics">
                                    {week.topics?.map((topic, i) => (
                                        <p key={i}>
                                            <i className={`fa-regular ${isCompleted ? "fa-circle-check" : "fa-circle"}`}></i>
                                            {topic}
                                        </p>
                                    ))}
                                </div>

                                {isCompleted ? (
                                    <>
                                        <div className="progress-container">
                                            <div
                                                className="progress-fill"
                                                style={{ width: "100%" }}
                                            ></div>
                                        </div>

                                        <p className="progress-text">
                                            {completedTopics} / {totalTopics} completed
                                        </p>
                                    </>
                                ) : isUnlocked ? (
                                    <button
                                        className="btn"
                                        onClick={() =>
                                            navigate(`/daily-plan/${week.weekNumber}`)
                                        }
                                    >
                                        Get Started
                                    </button>
                                ) : (
                                    <button className="btn" disabled>
                                         Locked
                                    </button>
                                )}

                            </div>
                        );
                    })}
                </div>

            </div>
            <ProfileModal
  isOpen={openProfile}
  onClose={() => setOpenProfile(false)}
/>
        </div>
    );
}

export default Roadmap;