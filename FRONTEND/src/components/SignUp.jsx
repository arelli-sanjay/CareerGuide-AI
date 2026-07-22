import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logo from "../assets/logo.png";
import API from "../api/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setError("All fields are required");
    }

    try {
      const res = await API.post("/auth/register", formData);

      // 🔥 FIX: auto login after signup (better UX)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Signup Successful 🎉");

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container">
      <div className="card">

        <div className="header">
          <div className="logo"><img src={logo} alt="img" /></div>
          <h2>CareerGuide AI</h2>
        </div>

        <hr />

        <h4 className="welcome">Create your account</h4>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email :</label>
            <div className="input-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password :</label>
            <div className="input-box">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="login-btn">Sign up</button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/")} className="a">Log in</span>
        </p>

      </div>
    </div>
  );
};

export default Signup;