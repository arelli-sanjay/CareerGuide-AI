import "./ProjectRoute.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";

function ProjectRoute() {

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setLoading(true);
                setError("");

        const userId = localStorage.getItem("userId");

        const project = JSON.parse(
        localStorage.getItem(`selectedProject_${userId}`)
        );

            if (!project) {
                setError("No project selected");
                return;
            }

        const savedPlan = localStorage.getItem(`projectPlan_${userId}`);

        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
            return;
        }

        const res = await API.post("/projects/plan", project);

        setPlan(res.data);

        localStorage.setItem(
            `projectPlan_${userId}`,
            JSON.stringify(res.data)
        );

            } catch (err) {
                console.error(err);
                setError("Failed to generate project plan");
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, []);

    //QUERY BOX
    const sendMessage = async () => {
        if (!input) return;

       const userId = localStorage.getItem("userId");

const project = JSON.parse(
  localStorage.getItem(`selectedProject_${userId}`)
);

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);

        setInput("");

        try {
            const res = await API.post("/projects/chat", {
                message: input,
                project
            });

            const botMsg = { role: "bot", content: res.data.reply };
            setMessages((prev) => [...prev, botMsg]);

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p style={{ padding: "20px" }}>Generating project plan...</p>;
    if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
    if (!plan) return <p style={{ padding: "20px" }}>No plan available</p>;

    return(
        <div className="projectroute">

            <div className="navbar">
                <div
                    className="back-btn"
                    onClick={() => navigate("/projects")}
                    style={{ cursor: "pointer" }}
                >
                    <i className="fa-solid fa-circle-arrow-left"></i>
                </div>
                <div className="wish">
                   <h4>Day-by-Day Plan to complete the Project</h4>
                </div>
            </div>

            <div className="dayplans">

                {/* ABSTRACT */}
                <div className="plan">
                    <div className="abstract">
                        <h2>Abstract</h2>
                        <p>{plan?.finalGoal}</p>
                    </div>

                    {/* RESOURCES */}
                    <div className="resources">
                        <h2>Resources</h2>

                        {plan.resources?.map((res, i) => (
                            <a
                                key={i}
                                href={res.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {res.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* TITLE */}
                <h2>Project - Day by Day Plan</h2>

                {/* DAYS */}
                {plan.days?.map((d, i) => (
                    <div className="plan" key={i}>
                        <h2>Day {d.day}</h2>
                        <p>{d.task}</p>
                        <p>{d.duration}</p>
                    </div>
                ))}

                {/* AI CHAT */}
                <div className="querybox" style={{ marginTop: "30px" }}>
                    <h3>Drop Your Query</h3>

                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
    {messages.map((msg, i) => (
        <div  
        key={i} style={{ marginBottom: "10px" }}>
            <b>{msg.role === "user" ? "Query" : "Output"}:</b>

            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {msg.content}
            </ReactMarkdown>
        </div>
    ))}
</div>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your project..."
                    />

                    <button onClick={sendMessage}>Send</button>
                </div>

            </div>
        </div>
    )
}

export default ProjectRoute;