import "./ProjectPlanner.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/project";
import ProfileModal from "../components/ProfileModal";

function ProjectPlanner() {

    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (user && !user.roadmapCompleted) {
            alert("Complete roadmap to unlock Project Planner");
            navigate("/roadmap");
            return;
        }

        const userId = localStorage.getItem("userId");

        const savedProject = localStorage.getItem(`selectedProject_${userId}`);
        const savedPlan = localStorage.getItem(`projectPlan_${userId}`);

        if (savedProject && savedPlan) {
            navigate("/project-route");
            return;
        }

        const fetchProjects = async () => {
            try {
                setLoading(true);

                const analysis = JSON.parse(
                    localStorage.getItem(`analysis_${userId}`)
                );

                //  FIX: SKILLS EXTRACTION (CRITICAL)
                const skills =
                    analysis?.knownSkills && analysis.knownSkills.length > 0
                        ? analysis.knownSkills
                        : analysis?.missingSkills && analysis.missingSkills.length > 0
                        ? analysis.missingSkills
                        : ["JavaScript"]; // fallback (VERY IMPORTANT)

                console.log("Skills Sent to Backend:", skills);

                const res = await getProjects({
                    role: analysis?.role || "Frontend Developer",
                    skills
                });

                const data = Array.isArray(res.data?.projects)
  ? res.data.projects
  : [];

  console.log("API RESPONSE:", res.data);

                setProjects(data);

                localStorage.setItem(`projects_${userId}`, JSON.stringify(data));

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const savedProjects = localStorage.getItem(`projects_${userId}`);
        const isLocked = localStorage.getItem(`projectLocked_${userId}`);

        if (isLocked && savedProjects) {
            setProjects(JSON.parse(savedProjects));
            return;
        }

        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
        } else {
            fetchProjects();
        }

        const savedSelected = localStorage.getItem(`selectedProject_${userId}`);
        if (savedSelected) {
            setSelected(JSON.parse(savedSelected));
        }

    }, []);


    const handleSelect = (project) => {
        const userId = localStorage.getItem("userId");

        if (selected?.title === project.title) {
            setSelected(null);
            localStorage.removeItem(`selectedProject_${userId}`);
        } else {
            setSelected(project);
            localStorage.setItem(`selectedProject_${userId}`, JSON.stringify(project));
        }
    };

    const handleConfirm = () => {
        if (!selected) return alert("Select a project");

        const userId = localStorage.getItem("userId");

        localStorage.setItem(`projectLocked_${userId}`, "true");

        navigate("/project-route");
    };
    return(
       <div className="projectplanner">
        <div className="topbar">
           <div className="wish">
            <h4>Select Your Project</h4>
            <p>Choose a real-world project and built it step by step with a guided plan.</p>
            </div>
            <div className="profile" onClick={() => setOpenProfile(true)}>
  <i className="fa-solid fa-circle-user"></i>
</div>
        </div>

        <div className="projects">

  {loading && <p>Loading projects...</p>}

  {projects.map((project, index) => (
    <div className="project" key={index}>

      <div className="name">
        <h4>
          {project?.title || "Project"} ({project?.difficulty || "intermediate"})
        </h4>

        <div className="icon">
          <input
            type="checkbox"
            checked={selected?.title === project.title}
            onChange={() => handleSelect(project)}
          />
        </div>
      </div>

      <h3>Skills Used:</h3>
      <p>
        {Array.isArray(project?.techStack)
          ? project.techStack.join(", ")
          : "N/A"}
      </p>

      <h3>Real World Relevance:</h3>
      <p>{project?.description || "No description available"}</p>

      <h3>Estimated Duration:</h3>
      <p>
        {project?.difficulty === "easy"
          ? "1 week"
          : project?.difficulty === "intermediate"
          ? "2-3 weeks"
          : "4-6 weeks"}
      </p>

      <h3>Abstract:</h3>
      <p>
        {Array.isArray(project?.keyFeatures)
          ? project.keyFeatures.join(", ")
          : "N/A"}
      </p>

    </div>
  ))}

</div>

        <div className="button">
            <button
                id="confirm-btn"
                onClick={handleConfirm}
                disabled={!selected}
            >
                Confirm
            </button>
        </div>
       <ProfileModal
  isOpen={openProfile}
  onClose={() => setOpenProfile(false)}
/>
       </div>
    )
}

export default ProjectPlanner;