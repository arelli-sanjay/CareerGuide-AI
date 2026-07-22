import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import logo from "../assets/logo.png";
import API from "../api/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await API.post("/auth/login", formData);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login Successful");

        navigate("/dashboard");

      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Login failed");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGuest = () => {
    localStorage.setItem("token", "guest");
    localStorage.setItem("userId", "guest");

    localStorage.setItem(
      "user",
      JSON.stringify({
        roadmapCompleted: false,
        projectCompleted: false,
        codeReviewScore: 0,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div className="logo"><img src={logo} alt="img" /></div>
          <h2>AI Career Co-Pilot</h2>
        </div>

        <hr />
        <h3 className="welcome">Welcome Back !</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email :</label>
            <div className="input-box">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
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
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button className="login-btn">Log in</button>
        </form>

        <hr />

        <p className="signup-text">
          Don’t have an account? <span><Link to="/signup" className="a">Sign up</Link></span>
        </p>

        <div className="divider"><span>Or</span></div>

        <button className="guest-btn" onClick={handleGuest}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default Login;