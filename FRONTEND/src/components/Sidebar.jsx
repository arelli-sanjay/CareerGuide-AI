import "./Sidebar.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        const userId = localStorage.getItem("userId");

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        localStorage.removeItem(`analysis_${userId}`);
        localStorage.removeItem(`roadmap_${userId}`);
        localStorage.removeItem(`projects_${userId}`);
        localStorage.removeItem(`selectedProject_${userId}`);
        localStorage.removeItem(`projectLocked_${userId}`);
        localStorage.removeItem(`completedSkills_${userId}`);

        navigate("/");
    };

    return(
        <div className="sidebar">

            <div className="logo">
                <img src={logo} alt ="logo"></img>
                <h2>CareerGuide AI</h2>
            </div>

            <div className="levels">

                <a href="/dashboard">
                    <div className="journey">
                        <i className="fa-solid fa-chart-line"></i>
                        <p>Dashboard</p>
                    </div>
                </a>

                <a href="/analysis">
                    <div className="journey">
                        <i className="fa-brands fa-searchengin"></i>
                        <p>Skill Analysis</p>
                    </div>
                </a>

                <a href="/roadmap">
                    <div className="journey">
                        <i className="fa-solid fa-route"></i>
                        <p>Learning Roadmap</p>
                    </div>
                </a>

                <a href="/projects">
                    <div className="journey">
                        <i className="fa-solid fa-file-circle-question"></i>
                        <p>Project Planner</p>
                    </div>
                </a>

                <a href="/code-review">
                    <div className="journey">
                        <i className="fa-solid fa-magnifying-glass-chart"></i>
                        <p>Code Review</p>
                    </div>
                </a>

                <a href="/roles">
                    <div className="journey">
                        <i className="fa-solid fa-person-circle-check"></i>
                        <p>Job Role Suggestion</p>
                    </div>
                </a>

            </div>

            <div className="logout">
                <hr/>

               <div className="journey" onClick={handleLogout} style={{ cursor: "pointer" }}>
    <i className="fa-solid fa-arrow-right-from-bracket"></i>
    <p>Logout</p>
</div>

            </div>

        </div>
    )
}

export default Sidebar;