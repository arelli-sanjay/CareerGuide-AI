import "./DailyPlan.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function DailyPlan() {

    const { weekId } = useParams();
    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);
    const userId = localStorage.getItem("userId");

    // LOAD WEEK DATA

    useEffect(() => {
        const fetchWeek = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await API.get(`/roadmap/week/${weekId}`);
                setWeek(res.data);

                const savedTasks = JSON.parse(
                    localStorage.getItem(
                        `week-${userId}-${weekId}-tasks`
                    )
                ) || [];

                setCompletedTasks(savedTasks);

            } catch (err) {
                console.error(err);
                setError("Failed to load week");
            } finally {
                setLoading(false);
            }
        };

        fetchWeek();
    }, [weekId]);

    const handleToggle = (dayNumber) => {

        let updated;

        if (completedTasks.includes(dayNumber)) {
            updated = completedTasks.filter(d => d !== dayNumber);
        } else {
            updated = [...completedTasks, dayNumber];
        }

        setCompletedTasks(updated);

        localStorage.setItem(
            `week-${userId}-${weekId}-tasks`,
            JSON.stringify(updated)
        );
    };

    const allCompleted =
        week?.days && completedTasks.length === week.days.length;

    const handleCompleteWeek = () => {

        if (!allCompleted) return;

        localStorage.setItem(
            `week-${userId}-${weekId}-completed`,
            "true"
        );

        const roadmap = JSON.parse(
            localStorage.getItem(`roadmap_${userId}`)
        ) || [];

        const completedWeeks = roadmap.filter(w =>
            localStorage.getItem(
                `week-${userId}-${w.weekNumber}-completed`
            ) === "true"
        );

        // EXTRACT SKILLS
        

        const completedSkills = completedWeeks.flatMap(w => w.topics);

        localStorage.setItem(
            `completedSkills_${userId}`,
            JSON.stringify(completedSkills)
        );

        if (completedWeeks.length === roadmap.length) {
            API.post("/user/roadmap/complete");
        }

        navigate("/roadmap");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!week) return null;

    return(
        <div className="dailyplan">

            <div className="navbar">
                <div
                    className="back-btn"
                    onClick={() => navigate("/roadmap")}
                >
                    <i className="fa-solid fa-circle-arrow-left"></i>
                </div>
            </div>

            <div className="main">
                <div className="cardn">

                    <div className="abstract">
                        <h1>Week {week.weekNumber}: <span>{week.title}</span></h1>
                        <p className="goal"><b>Goal:</b> {week.goal}</p>
                        <p className="time"><b>Estimated Time:</b> {week.estimatedTime}</p>
                    </div>

                    <h2>Daily Plan</h2>

                    {week.days?.map((d, i) => (
                        <div className="task" key={i}>
                            <input
                                type="checkbox"
                                checked={completedTasks.includes(d.day)}
                                onChange={() => handleToggle(d.day)}
                            />
                            <span><b>Day {d.day}</b> {d.task}</span>
                            <div className="badge">{d.duration}</div>
                        </div>
                    ))}

                    <h2 className="res-title">Resources</h2>

                    {week.resources?.map((r, i) => (
                        <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource"
                            key={i}
                        >
                            {r.title}
                            <span>›</span>
                        </a>
                    ))}

                    <button
                        onClick={handleCompleteWeek}
                        disabled={!allCompleted}
                    >
                        Mark Week {week.weekNumber} as Completed
                    </button>

                    <p className="note">
                        {!allCompleted
                            ? "Complete all tasks to unlock next week"
                            : "Ready to continue"}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default DailyPlan;