import "./CodeReview.css";
import { useState, useEffect } from "react";
import API from "../api/api";
import ProfileModal from "../components/ProfileModal";

function CodeReview(){

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user && !user.roadmapCompleted) {
            alert("Complete roadmap first");
            window.location.href = "/roadmap";
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleSubmit = async () => {
        if (!file) {
            alert("Please upload a ZIP file");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", file);

            const res = await API.post("/review/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setResult(res.data);

            //  UNLOCK JOB ROLE SUGGESTION
            if (res.data.score >= 7) {
                const updatedUser = await API.get("/user/me");
                localStorage.setItem("user", JSON.stringify(updatedUser.data));

                alert("🎉 Job role suggestions unlocked!");
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to analyze code");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="codereview">
            <div className="topbar">
                <div className="wish">
                    <h2>Project Code Review</h2>
                </div>
                <div className="profile" onClick={() => setOpenProfile(true)}>
                    <i className="fa-solid fa-circle-user"></i>
                </div>
            </div>

            <div className="review-container">
                <h1>Project Code Review</h1>

                <p className="description">
                    Upload the ZIP file of your project code and I'll review it.
                </p>

                <div className="upload-box">
                    <label className="upload-btn">
                        <input
                            type="file"
                            accept=".zip"
                            hidden
                            onChange={handleFileChange}
                        />
                         Upload ZIP file
                    </label>
                </div>

                <div className="submit">
                    <button className="submit-btn" onClick={handleSubmit}>
                        {loading ? "Analyzing..." : "Submit"}
                    </button>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}


                <div className="card">
                    <h2 className="title">Code Review Result</h2>

                    {!result && <p>Upload to see analysis</p>}

                    {result && (
                        <>
                            <ul className="info-list">
                                <li><strong>Score:</strong> {result.score}/10</li>
                            </ul>

                            {/* Strengths */}
                            <h3>Strengths</h3>
                            {result.strengths?.length > 0 ? (
                                result.strengths.map((item, i) => (
                                    <p key={i}> {item}</p>
                                ))
                            ) : (
                                <p>No strengths found</p>
                            )}

                            {/* Issues */}
                            <h3>Issues</h3>
                            {result.issues?.length > 0 ? (
                                result.issues.map((item, i) => (
                                    <p key={i}> {item}</p>
                                ))
                            ) : (
                                <p>No major issues</p>
                            )}

                            {/* Suggestions */}
                            <h3>Suggestions</h3>
                            {result.suggestions?.length > 0 ? (
                                result.suggestions.map((item, i) => (
                                    <p key={i}>{item}</p>
                                ))
                            ) : (
                                <p>No suggestions</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            <ProfileModal
                isOpen={openProfile}
                onClose={() => setOpenProfile(false)}
            />
        </div>
    )
}

export default CodeReview;