import "./RolesSuggest.css";
import { useEffect, useState } from "react";
import { getJobRecommendations } from "../api/jobs";
import ProfileModal from "../components/ProfileModal";

function RolesSuggest(){

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

     const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.projectCompleted || user.codeReviewScore <= 7) {
        alert("Score above 7 required to unlock job roles");
        window.location.href = "/code-review";
        return;
    }

    const fetchJobs = async () => {
        try {
            setLoading(true);

            const userId = localStorage.getItem("userId");

            const project = JSON.parse(
                localStorage.getItem(`selectedProject_${userId}`)
            );

            const analysis = JSON.parse(
                localStorage.getItem(`analysis_${userId}`)
            );

                    const completedSkills =
            analysis?.knownSkills?.length > 0
                ? analysis.knownSkills
                : analysis?.missingSkills || [];

        console.log("Analysis:", analysis);
        console.log("Project:", project);
        console.log("Completed Skills:", completedSkills);

        const res = await getJobRecommendations({
            role: analysis?.role || "Frontend Developer",
            completedSkills,
            project,
        });

            setJobs(res.data.jobs);

        } catch (err) {
            console.error(err);
            setError("Failed to load job recommendations");
        } finally {
            setLoading(false);
        }
    };

    fetchJobs();

}, []);

    return(

        <div className="rolesuggest">
             <div className="topbar">
                <div className="upload">
                    <h4>Job Roles You're Ready For</h4>
                    <p>Based on the skills and tasks you've successfully completed.</p>
                </div>
                   <div className="profile" onClick={() => setOpenProfile(true)}>
  <i className="fa-solid fa-circle-user"></i>
</div>
            </div>

            <div className="roles">

                {/* Loading */}
                {loading && <p>Loading job recommendations...</p>}

                {/* Error */}
                {error && <p style={{color:"red"}}>{error}</p>}

                {/* Dynamic Roles */}
                {jobs.map((job, index) => (
                    <div className="role" key={index}>

                        <h4>{job.title}</h4>

                        <p>
                            {job.matchReason}
                        </p>
                        
                        <h5>Required Skills:</h5>
                        <ul>
                            {job.requiredSkills?.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ul>

                        {/*  Optional Missing Skills */}
                        {job.missingSkills && job.missingSkills.length > 0 && (
                            <>
                                <h5>Missing Skills:</h5>
                                <ul>
                                    {job.missingSkills.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                    </div>
                ))}

            </div>
            <ProfileModal
  isOpen={openProfile}
  onClose={() => setOpenProfile(false)}
/>
        </div>
    )
}

export default RolesSuggest;